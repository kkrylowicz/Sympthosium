from datetime import datetime
import numpy as np
import json
from uuid import uuid4
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from model import model
from database import get_db
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user
)

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MODELE DANYCH ====================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class Payload(BaseModel):
    symptoms: list[int]

class DiagnosisEntry(BaseModel):
    id: Optional[str] = None
    disease: str
    symptoms: list[int]
    note: str = ""
    date: Optional[str] = None
    confirmed: bool = False

# ==================== LISTA SYMPTOMÓW ====================

SYMPTOMS = {
    0: "Fever", 1: "Cough", 2: "Fatigue", 3: "Headache", 4: "Nausea",
    5: "Vomiting", 6: "Diarrhea", 7: "Abdominal Pain", 8: "Chest Pain",
    9: "Shortness of Breath", 10: "Dizziness", 11: "Rash", 12: "Joint Pain",
    13: "Muscle Pain", 14: "Swelling", 15: "Weight Loss", 16: "Weight Gain",
    17: "Night Sweats", 18: "Chills", 19: "Sore Throat", 20: "Runny Nose",
    21: "Sneezing", 22: "Loss of Appetite", 23: "Vision Problems", 24: "Confusion",
    25: "Seizures", 26: "Paralysis", 27: "Numbness", 28: "Tingling",
    29: "Increased Thirst", 30: "Increased Urination", 31: "Hair Loss",
    32: "Jaundice", 33: "Itching", 34: "Heart Palpitations", 35: "Anxiety",
    36: "Heat Intolerance", 37: "Cold Intolerance", 38: "Balance Issues",
    39: "Memory Loss", 40: "Difficulty Swallowing", 41: "Anosmia",
    42: "Wheezing", 43: "Neck Stiffness", 44: "Dark Urine",
}

@app.get("/all-symptoms")
async def all_symptoms():
    return SYMPTOMS

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.post("/register", response_model=Token)
async def register(user: UserRegister):
    """Rejestracja nowego użytkownika"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Sprawdź czy email już istnieje
        cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hashuj hasło i zapisz użytkownika
        hashed_password = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
            (user.name, user.email, hashed_password)
        )
        user_id = cursor.lastrowid
        
        # Utwórz token
        access_token = create_access_token(data={"sub": str(user_id), "email": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user.name,
                "email": user.email
            }
        }

@app.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Logowanie użytkownika"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Znajdź użytkownika
        cursor.execute(
            "SELECT id, name, email, hashed_password FROM users WHERE email = ?",
            (credentials.email,)
        )
        user = cursor.fetchone()
        
        if not user or not verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Utwórz token
        access_token = create_access_token(data={"sub": str(user["id"]), "email": user["email"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }

@app.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Zwraca dane zalogowanego użytkownika"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, email FROM users WHERE id = ?",
            (current_user["user_id"],)
        )
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }

# ==================== ML PREDICTION (Public - no auth required) ====================

@app.post("/symptoms")
async def symptoms(payload: Payload):
    """Predykcja choroby na podstawie symptomów - dostępne bez logowania"""
    inp = np.array(payload.symptoms).reshape(1, -1)
    prediction = model.predict(inp)
    
    disease_name = (
        prediction[0] if isinstance(prediction[0], str) else str(prediction[0])
    )
    
    return {"predicted_disease": disease_name}

# ==================== HISTORY CRUD (Protected - requires auth) ====================

@app.post("/history")
async def add_history(
    entry: DiagnosisEntry,
    current_user: dict = Depends(get_current_user)
):
    """Dodaj diagnozę do historii zalogowanego użytkownika"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        entry_id = str(uuid4())
        date = datetime.now().strftime("%d-%m-%Y %H:%M")
        
        cursor.execute("""
            INSERT INTO diagnoses (id, user_id, disease, symptoms, note, date, confirmed)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            entry_id,
            current_user["user_id"],
            entry.disease,
            json.dumps(entry.symptoms),
            entry.note,
            date,
            0
        ))
        
        return {
            "id": entry_id,
            "disease": entry.disease,
            "symptoms": entry.symptoms,
            "note": entry.note,
            "date": date,
            "confirmed": False
        }

@app.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    """Pobierz historię diagnoz zalogowanego użytkownika"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, disease, symptoms, note, date, confirmed
            FROM diagnoses
            WHERE user_id = ?
            ORDER BY date DESC
        """, (current_user["user_id"],))
        
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            result.append({
                "id": row["id"],
                "disease": row["disease"],
                "symptoms": json.loads(row["symptoms"]),
                "note": row["note"],
                "date": row["date"],
                "confirmed": bool(row["confirmed"])
            })
        
        return result

@app.put("/history/{entry_id}")
async def update_history(
    entry_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user)
):
    """Edytuj diagnozę (tylko własne)"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Sprawdź czy diagnoza należy do użytkownika
        cursor.execute(
            "SELECT id FROM diagnoses WHERE id = ? AND user_id = ?",
            (entry_id, current_user["user_id"])
        )
        
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Entry not found or unauthorized")
        
        # Aktualizuj
        if "note" in payload:
            cursor.execute(
                "UPDATE diagnoses SET note = ? WHERE id = ?",
                (payload["note"], entry_id)
            )
        
        if "confirmed" in payload:
            cursor.execute(
                "UPDATE diagnoses SET confirmed = ? WHERE id = ?",
                (1 if payload["confirmed"] else 0, entry_id)
            )
        
        # Pobierz zaktualizowane dane
        cursor.execute(
            "SELECT id, disease, symptoms, note, date, confirmed FROM diagnoses WHERE id = ?",
            (entry_id,)
        )
        row = cursor.fetchone()
        
        return {
            "id": row["id"],
            "disease": row["disease"],
            "symptoms": json.loads(row["symptoms"]),
            "note": row["note"],
            "date": row["date"],
            "confirmed": bool(row["confirmed"])
        }

@app.delete("/history/{entry_id}")
async def delete_history(
    entry_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Usuń diagnozę (tylko własne)"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Sprawdź czy diagnoza należy do użytkownika
        cursor.execute(
            "SELECT id FROM diagnoses WHERE id = ? AND user_id = ?",
            (entry_id, current_user["user_id"])
        )
        
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Entry not found or unauthorized")
        
        cursor.execute("DELETE FROM diagnoses WHERE id = ?", (entry_id,))
        
        return {"message": "Deleted successfully"}

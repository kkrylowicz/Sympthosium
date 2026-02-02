import sqlite3
from contextlib import contextmanager

DB_NAME = "sympthosium.db"

@contextmanager
def get_db():
    """Context manager dla połączenia z bazą danych"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Zwraca wiersze jako słowniki
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Inicjalizacja bazy danych - tworzy tabele jeśli nie istnieją"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Tabela użytkowników
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tabela diagnoz
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS diagnoses (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                disease TEXT NOT NULL,
                symptoms TEXT NOT NULL,
                note TEXT DEFAULT '',
                date TEXT NOT NULL,
                confirmed BOOLEAN DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()
        print("✅ Database initialized successfully")

# Inicjalizuj bazę przy imporcie modułu
init_db()

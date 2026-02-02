import "./SymptomAnalysis.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import DiagnosisResult from "../DiagnosisResult/DiagnosisResult";
import database from "../../data/data.json";

// List of symptoms used for the dropdown and ML model input
const symptomsList = [
  "Fever", "Cough", "Fatigue", "Headache", "Nausea", "Vomiting", "Diarrhea",
  "Abdominal pain", "Chest pain", "Shortness of breath", "Dizziness", "Rash",
  "Joint pain", "Muscle Pain", "Swelling", "Weight loss", "Weight gain",
  "Night sweats", "Chills", "Sore throat", "Runny nose", "Sneezing",
  "Loss of appetite", "Vision problems", "Confusion", "Seizures", "Paralysis",
  "Numbness", "Tingling", "Increased thirst", "Increased urination",
  "Hair loss", "Jaundice", "Itching", "Heart palpitations", "Anxiety",
  "Heat intolerance", "Cold intolerance", "Balance issues", "Memory loss",
  "Difficulty swallowing", "Anosmia (loss of smell)", "Wheezing",
  "Neck stiffness", "Dark urine",
];

// Main component for symptom selection and diagnosis
export default function SymptomAnalysis() {
  // UI state for dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  // Tracks user selection
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  // Stores the result data (switches view when not null)
  const [diagnosisData, setDiagnosisData] = useState(null);
  // Auth context for API requests
  const { token, isAuthenticated } = useAuth();

  // Saves the current diagnosis to the user's history (requires login)
  const saveToHistory = async (disease, symptomsArray) => {
    if (!isAuthenticated) {
      alert("Please log in to save diagnosis to history");
      return;
    }
    
    try {
      // API Call to save entry
      await fetch("http://localhost:8000/history", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          disease: disease,
          symptoms: symptomsArray,
          note: "",
        }),
      });
      alert("Diagnosis saved to history!");
    } catch (error) {
      console.error("Error saving to history:", error);
      alert("Failed to save diagnosis");
    }
  };

  // Toggles symptom selection state
  const handleCheckboxChange = (symptom) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptom]: !prev[symptom],
    }));
  };

  // Core function: validates input, calls ML API, and matches with database
  const handleDiagnose = async () => {
    const count = Object.values(selectedSymptoms).filter(
      (val) => val === true
    ).length;
    
    // Validation: Minimum 4 symptoms
    if (count < 4) {
      alert("Please select at least 4 symptoms to proceed with diagnosis.");
      return;
    }

    // Convert selection to binary format for the AI model
    const numbersArray = symptomsList.map((symptom) =>
      selectedSymptoms[symptom] ? 1 : 0
    );

    try {
      // API Call to ML service
      const response = await fetch("http://localhost:8000/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: numbersArray }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const backendPrediction = data.predicted_disease;

      // Find detailed info in local database
      const foundDisease = database.find(
        (item) =>
          item.Disease?.trim().toLowerCase() ===
          backendPrediction?.trim().toLowerCase()
      );

      // Prepare result object (with fallback if not found)
      const resultData = foundDisease ? { ...foundDisease } : {
          Disease: backendPrediction || "Unknown",
          Description: "No matching disease found in the database.",
          Symptoms: "N/A",
      };

      resultData.rawPrediction = backendPrediction;
      resultData.rawSymptoms = numbersArray;

      setDiagnosisData(resultData);

    } catch (error) {
      console.error("Error diagnosing:", error);
      alert("Failed to get diagnosis. Please try again.");
    }
  };

  const closeDiagnosis = () => {
    setDiagnosisData(null);
    setSelectedSymptoms({});
    setIsOpen(false);
  };

  // Conditional rendering: Show Result component if diagnosis exists
  if (diagnosisData) {
    return (
      <DiagnosisResult 
        data={diagnosisData} 
        onBack={closeDiagnosis} 
        onSave={saveToHistory}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // Default View: Symptom Selection Form
  return (
    <main className="symptoms-page">
      <div className="symptoms-page-container">
        <Link to="/">
          <button className="close-button">x</button>
        </Link>
        <div className="symptoms-page-text">
          <h1 className="symptoms-page-title">Symptom Analysis</h1>
          <ol>
            <li className="symptoms-page-step">
              Check off any symptoms that apply to what you are feeling.
            </li>
            <li className="symptoms-page-step">Press the <b>DIAGNOSE</b> button.</li>
            <li className="symptoms-page-step">
              Get insights about what you are experiencing.
            </li>
          </ol>
          <p>
            A minimum of 4 symptoms <br /> is required to continue!
          </p>
        </div>
        <div className="symptoms-rigth section">
          <div className="dropdown-container">
            <div
              className={`dropdown-header ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>Select your symptoms...</span>
              <span className="arrow">
                {isOpen ? (
                  <img src="/img/oui_arrow_up.png" alt="" />
                ) : (
                  <img src="/img/oui_arrow_down.png" alt="" />
                )}
              </span>
            </div>
            {isOpen && (
              <div className="dropdown-list">
                {symptomsList.map((symptom) => (
                  <label key={symptom} className="dropdown-list-item">
                    <input
                      type="checkbox"
                      checked={!!selectedSymptoms[symptom]}
                      onChange={() => handleCheckboxChange(symptom)}
                    />
                    <span className="symptom-label">{symptom}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="symptoms-diagnose-wrapper">
            <button className="diagnose-button" onClick={handleDiagnose}>
              DIAGNOSE <span>{">"}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
import { useState } from 'react';
import './DiagnosisResult.css';
import { Link } from 'react-router-dom';

// Component for displaying the diagnosis result and providing actionable steps
export default function DiagnosisResult({ data, onBack, onSave }) {
    
    // Tracks if the diagnosis has been saved to the history to prevent duplicates
    const [isSaved, setIsSaved] = useState(false);

    // Handles the save logic, ensuring raw data exists before calling the API
    const handleSaveClick = async () => {
        if (data.rawPrediction && data.rawSymptoms) {
            await onSave(data.rawPrediction, data.rawSymptoms);
            setIsSaved(true);
        } else {
            console.error("Missing raw data (rawPrediction/rawSymptoms) in data object");
        }
    };

    // Static data for the recommendation cards displayed on the right
    const diseaseresultBox = [
        {
            icon: <img src="/img/diag_rec.png" alt="Reccomendation icon" />,
            title: "Recomendation",
            description: "Professional medical guidance advised."
        },
        {
            icon: <img src="/img/diag_care.png" alt="When to seek care icon" />,
            title: "When to seek care",
            description: "If symptoms worsen or persist."
        },
        {
            icon: <img src="/img/diag_self.png" alt="Self-care icon" />,
            title: "Self-care",
            description: "Rest and stay hydrated."
        }
    ];

    return (
        <div className="result-container">
            <div className="result-card">
                
                {/* Close button/Link to home page */}
                <Link to="/" className="close-btn-x">x</Link>
                
                <h2>Based on the symptoms, your possible diagnosis is...</h2>                
                
                <div className="disease-content-wrapper" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    
                    {/* Left column: Disease name, description, symptoms, and resources */}
                    <div className="disease-left-side">
                        <div className="disease-name">
                            <h1 className="disease-title">{data.Disease}</h1>
                        </div>
                        <div className="disease-line"></div>
                        <div className="disease-info">
                            <div>
                                <p className="disease-description">{data.Description}</p>
                            </div>
                            <div>
                                <h3>Common Symptoms:</h3>
                                <p className="disease-symptoms">{data.Symptoms}</p>
                            </div>
                            <div>
                                <h3>Useful Resources:</h3>
                                <ul className="disease-resources">
                                    {data.Resources?.map((resource, index) => (
                                        <li key={index}>
                                            <a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>                        
                    </div>

                    {/* Right column: General medical advice cards */}
                    <div className="disease-right-side">
                        <div className="disease-result-grid">
                            {diseaseresultBox.map((box, index) => (
                                <div key={index} className="our-team-box">
                                    <div className="box-icon-wrapper">
                                        <span className="box-icon">{box.icon}</span>
                                    </div>
                                    <h3 className="box-title">{box.title}</h3>
                                    <div className="box-description">
                                        {box.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action buttons: Save to History and Start New Diagnosis */}
                <div className="diagnosis-actions">
                    <button 
                        className={`action-btn btn-save ${isSaved ? 'saved' : ''}`} 
                        onClick={handleSaveClick}
                        disabled={isSaved}
                    >
                        {isSaved ? "✓ Saved to History" : "Save Result"}
                    </button>
                            
                    <button className="action-btn btn-back" onClick={onBack}>
                        New Diagnosis
                    </button>
                </div>        
            </div>
        </div>
    );
}
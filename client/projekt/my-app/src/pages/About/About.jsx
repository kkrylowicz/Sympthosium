import './About.css';
import { Link } from 'react-router-dom';

// Main component for the About page
export default function About() {
    
    // Data for the "Our Approach" cards
    const approachBox = [
        {
            icon: <img src="/img/about_data.png" alt="Data icon" />,
            title: "DATA",
            description: "We analyze symptom patterns using validated medical datasets."
        },
        {
            icon: <img src="/img/about_reasoning.png" alt="Reasoning icon" />,
            title: "REASONING",
            description: "Our AI uses decision-support algorithms similar to those found in professional clinical tools."
        },
        {
            icon: <img src="/img/about_safety.png" alt="Safety icon" />,
            title: "SAFETY",
            description: "We never diagnose - we guide with probabilities and recommendations."
        },
        {
            icon: <img src="/img/about_privacy.png" alt="Privacy icon" />,
            title: "PRIVACY",
            description: "Your information is securely stored and never shared or sold."
        }
    ];

    return (
        <main className="about-content">
            
            {/* Hero Section */}
            <div className="about-page">
                <h1 className="Main-text-about">SYMPTHOSIUM</h1>
                <h2 className="title-description">Empowering people with fast, trustworthy health insights.</h2>
                <p className="about-description">Symptosium uses advanced AI and a structured medical database to interpret symptoms and deliver clear, evidence-based health insights. Our goal is to make reliable guidance fast, accessible, and trustworthy.</p>
                
                <div className="symptom-analysis-button">
                    <p className="symptom-analysis-text">
                        <Link to="/symptom-analysis">Symptom analysis</Link>
                    </p>
                </div>
            </div>

            {/* Our Approach Section (Cards) */}
            <div className="our-approach-section">
                <h2 className="section-title">Our Approach</h2>
                <p className="section-description">Built on data. Designed for clarity.</p>
                
                <div className="approach-details">
                    {approachBox.map((box, index) => (
                    <div key={index} className="approach-box">
                        <div className="box-icon">{box.icon}</div>
                        <h3 className="box-title">{box.title}</h3>
                        <p className="box-description">{box.description}</p>
                    </div>
                    ))}
                </div>
            </div>    

            {/* How it Works Section (Steps) */}
            <div className="how-it-works-section">
                <h2 className="section-title">How it works?</h2>
                <p className="section-description">From symptoms to clarity in easy steps.</p>
                
                <div className="how-it-works-container">
                    <div className="how-it-works-text">
                        <ol className="how-it-works-steps">
                            <li className="step-item">
                                <span className="step-number">1</span> 
                                <div className="step-content">
                                    <h3 className="step-title">Select your symptoms</h3>   
                                    <p className="step-description">Choose the symptoms you are experiencing by selecting from our guided list designed to make the process simple, clear, and intuitive.</p>
                                </div>
                            </li>
                            
                            <li className="step-item">
                                <span className="step-number">2</span> 
                                <div className="step-content">
                                    <h3 className="step-title">Symptom pattern analysis</h3>
                                    <p className="step-description">Our AI analyzes your selected symptoms by comparing them to trusted medcial patterns using validated clinical data and transparent reasoning methods.</p>
                                </div>
                            </li>
                            
                            <li className="step-item">
                                <span className="step-number">3</span> 
                                <div className="step-content"> 
                                    <h3 className="step-title">Potential diagnosis</h3>   
                                    <p className="step-description">Receive clear insights into possible conditions based on your symptom patterns, along with guidance on what to consider next. Not a diagnosis.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className="how-it-works-image-container">
                        <img src="/img/ab_howitworks.png" alt="How it works illustration" className="how-it-works-image"/>    
                    </div>
                </div>   
            </div>
        </main>
    )
}
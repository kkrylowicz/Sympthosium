import './TitlePage.css';
import { Link } from 'react-router-dom';

// Main Landing Page component
export default function TitlePage() {
  return (
      <main className='app-content'>
        
        {/* Left Section: Hero Text & Call to Action */}
        <div className='Main-text-container'>
          <p className='Main-text'>We bring AI to</p>
          <h1 className='Main-caps'>HEALTHCARE.</h1>
          <p className='Text'>Instant, AI-powered symptom analysis to guide you toward the right diagnosis.</p>
          <div className='symptom-analysis-button'>
            <p className="symtom-analysis-text"><Link to="/symptom-analysis">Symptom analysis</Link></p>
          </div>
        </div>

        {/* Right Section: Hero Image & Navigation Links */}
        <div className='Main-image-container'>
          <img src="/img/dna.png" alt="DNA image" className='Main-image'/>
          
          {/* Navigation Overlay */}
          <div className="nav-links-overlay">
            <Link to="/about" className="nav-about">
            <span>About</span>
            <span className="button-icon">+</span>
            </Link>
            <Link to="/database" className="nav-database">
            <span>Database</span>
            <span className="button-icon">+</span>
            </Link>
            <Link to="/contact" className="nav-contact">
            <span>Contact</span>
            <span className="button-icon">+</span>
            </Link>
            <Link to="/history" className="nav-history">
            <span>History</span>
            <span className="button-icon">+</span>
            </Link>
          </div>
        </div>
      </main>
  )
}
import './Footer.css';

// Global Footer component displayed on all pages
export default function Footer() {
  return (
    <footer className="footer">
      
      {/* Branding Section */}
      <div className="footer-top">
        <img src="/img/logo_no_background.png" alt="Footer logo" className='footer-logo'/>
        <p><b>SYMPTHOSIUM</b><br></br>We bring AI to healthcare</p>
      </div> 
      
      <div className='footer-line'></div>
      
      {/* Contact Information */}
      <div className='footer-bottom'>
        <ul className="footer-links">
          <li className="footer-location">
            <img src="/img/foot-lokalizacja.png" alt="Location" />
            <span>Wydział Biologii UAM</span>
          </li>
          <li className="footer-phone">
            <img src="/img/foot-telefon.png" alt="Phone number" />
            <span>+48 123 456 789</span>  
          </li>
          <li className="footer-email">
            <img src="/img/foot-mail.png" alt="Email" />
            <span>sympthosium@gmail.com</span>
          </li>
        </ul>
      </div>
    </footer>
  )
}
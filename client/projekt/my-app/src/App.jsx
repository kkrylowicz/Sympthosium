import { useState } from "react"
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import TitlePage from './pages/TitlePage/TitlePage.jsx'
import About from './pages/About/About.jsx'
import Database from './pages/Database/Database.jsx'
import Contact from './pages/Contact/Contact.jsx'
import SymptomAnalysis from './pages/SymptomAnalysis/SymptomAnalysis.jsx'
import LoginPanel from './pages/LoginPanel/LoginPanel.jsx'
import History from './pages/History/History.jsx';

// Wrapper component to secure routes that require login
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking token
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      Loading...
    </div>;
  }
  
  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Main layout structure with Header, Footer and dynamic content
function AppContent() {
  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<TitlePage />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/database" element={<Database />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/symptom-analysis" element={<SymptomAnalysis />} />
          <Route path="/login" element={<LoginPanel />} />
          
          {/* Private Route - accessible only after login */}
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main> 
      <Footer />
    </div>
  );
}

// Root component initializing Router and Auth Context
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
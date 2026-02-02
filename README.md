# 🏥 Sympthosium - AI-Powered Symptom Analysis System

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3+-F7931E?logo=scikit-learn)](https://scikit-learn.org/)

An intelligent web application that analyzes user-reported symptoms and provides potential disease diagnoses using machine learning. Built with React (Vite) frontend and FastAPI backend.

> ⚠️ **Medical Disclaimer**: This application is for **educational purposes only** and does not replace professional medical diagnosis. Always consult with a healthcare provider for medical concerns.

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Architecture](#-architecture)
- [Dataset](#-dataset)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)

---

## ✨ Features

- **Interactive Symptom Selection**: Choose from 45 different symptoms via intuitive dropdown interface
- **AI-Powered Diagnosis**: Machine learning model trained on 1,200+ medical examples
- **Realistic Disease Modeling**: Dataset includes 40 variations per disease to reflect real-world symptom diversity
- **Instant Results**: Get potential diagnoses with detailed descriptions and resources
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **RESTful API**: Clean FastAPI backend with CORS support

---

## 🎯 Demo

### How It Works

1. **Select Symptoms** - Choose at least 4 symptoms from the comprehensive list
2. **Analyze** - Click the "DIAGNOSE" button
3. **Get Results** - View potential diagnosis with detailed information and resources

![Symptom Selection](/client/projekt/my-app/public/img/symptoms2.png)
_Symptom selection interface_

![Diagnosis Result](/client/projekt/my-app/public/img/diagnosis.png)
_Diagnosis result page_

---

## 🏗️ Architecture

```
┌─────────────────┐         HTTP/JSON          ┌─────────────────┐
│   React Frontend│ ◄──────────────────────────►│ FastAPI Backend │
│   (Vite + SPA)  │    POST /symptoms          │  (Python 3.x)   │
└─────────────────┘    [0,1,0,1,...]           └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│  Local JSON DB  │                           │ Decision Tree   │
│  (Disease Info) │                           │   ML Model      │
└─────────────────┘                           └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │  Training Data  │
                                              │  (1,200 rows)   │
                                              └─────────────────┘
```

### Data Flow

1. User selects symptoms in the frontend
2. Frontend converts selections to binary array: `[1, 0, 1, 0, ...]` (45 elements)
3. POST request sent to `/symptoms` endpoint
4. Backend feeds array to trained Decision Tree model
5. Model predicts disease name
6. Backend returns prediction as JSON
7. Frontend searches local database for disease details
8. Results displayed with description, common symptoms, and resources

---

## 📊 Dataset

### Overview

- **Total Examples**: 1,200 rows
- **Diseases Covered**: 30 different conditions
- **Symptoms Tracked**: 45 unique symptoms
- **Variations per Disease**: 40 medically realistic variations

### Why 40 Variations?

Real diseases don't present identically in every patient. Our dataset reflects this reality:

- **Core Symptoms** (85-95% occurrence) - Nearly always present
- **Common Symptoms** (60-80% occurrence) - Frequently present
- **Optional Symptoms** (30-60% occurrence) - Sometimes present
- **Medical Noise** (3-8% occurrence) - Rarely present atypical symptoms

**Example - Influenza:**

```
Patient A: Fever, Cough, Fatigue, Headache, Muscle Pain
Patient B: Fever, Fatigue, Headache, Chills (no cough)
Patient C: Cough, Fatigue, Muscle Pain, Sore Throat (no fever)
```

All three have influenza, but with different symptom combinations.

### Disease Categories

🫁 **Respiratory**: Influenza, COVID-19, Pneumonia, Asthma, COPD, Bronchitis, Tuberculosis  
❤️ **Cardiovascular**: Hypertension, Heart Failure, Arrhythmia, Coronary Artery Disease  
🧠 **Neurological**: Migraine, Stroke, Alzheimer's, Parkinson's, Multiple Sclerosis, Meningitis  
🩸 **Metabolic**: Diabetes Type 1/2, Hypothyroidism, Hyperthyroidism  
🦴 **Autoimmune**: Rheumatoid Arthritis, Lupus, Osteoarthritis  
🔬 **Other**: Hepatitis B/C, Anemia, Lung Cancer

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.8 or higher
- **npm** or **yarn**
- **pip** (Python package manager)

### Backend Setup

```bash
# Navigate to backend directory
cd server

# Install Python dependencies
pip install fastapi uvicorn scikit-learn pandas numpy

# Run the FastAPI server
python -m uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Quick Start (All-in-One)

```bash
# Clone the repository
git clone https://github.com/kdreze/sympthosium.git
cd sympthosium

# Start backend (Terminal 1)
cd server
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

# Start frontend (Terminal 2)
cd client
npm install
npm run dev
```

---

## 💻 Usage

### User Interface

1. Open `http://localhost:5173` in your browser
2. Click on the symptom dropdown
3. Select **at least 4 symptoms** that apply
4. Click **"DIAGNOSE"** button
5. View your results with detailed information

### API Usage

#### Endpoint: `POST /symptoms`

**Request:**

```json
{
  "symptoms": [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, ...]
}
```

_Array of 45 binary values (0 or 1) representing absence/presence of each symptom_

**Response:**

```json
{
  "predicted_disease": "Influenza"
}
```

#### Endpoint: `GET /all-symptoms`

**Response:**

```json
{
  "0": "Fever",
  "1": "Cough",
  "2": "Fatigue",
  ...
}
```

---

## 📂 Project Structure

```
sympthosium/
├── backend/
│   ├── main.py                 # FastAPI application & endpoints
│   ├── model.py                # ML model training & loading
│   └── sympthosium_augmented.csv  # Augmented dataset (1,200 rows)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SymptomAnalysis.jsx      # Main symptom selection page
│   │   │   └── DiagnosisResult.jsx      # Results display page
│   │   ├── data/
│   │   │   └── data.json                # Disease details database
│   │   └── App.jsx                      # Root component
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Technologies Used

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling

### Backend

- **FastAPI** - Modern Python web framework
- **uvicorn** - ASGI server
- **scikit-learn** - Machine learning (Decision Tree Classifier)
- **pandas** - Data manipulation
- **numpy** - Numerical computing

### Tools & Design

- **Figma** - UI/UX Prototyping
- **Git** - Version control
- **Postman** - API testing

### Machine Learning

- **Algorithm**: Decision Tree Classifier
- **Training Data**: 1,200 symptom-disease pairs
- **Features**: 45 binary symptom indicators
- **Output**: Single disease classification

---

## 🔧 Configuration

### CORS Settings

The backend is configured to accept requests from the Vite development server:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, update `allow_origins` to your deployed frontend URL.

### Environment Variables

Create `.env` files for configuration:

**Backend `.env`:**

```
PORT=8000
CORS_ORIGINS=http://localhost:5173
```

**Frontend `.env`:**

```
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Improvement

- [ ] Add more diseases to the dataset
- [ ] Implement user authentication
- [ ] Add symptom severity levels
- [ ] Include age/gender considerations
- [ ] Multi-language support
- [ ] Export diagnosis reports as PDF
- [ ] Add visualization charts for symptom correlations

---

## ⚕️ Medical Disclaimer

**IMPORTANT**: This application is designed for **educational and informational purposes only**. It is NOT intended to:

- Replace professional medical advice, diagnosis, or treatment
- Be used for self-diagnosis or self-medication
- Substitute consultation with qualified healthcare providers

Always seek the advice of a physician or other qualified health provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information obtained from this application.

The machine learning model's predictions are based on statistical patterns and may not account for individual patient circumstances, medical history, or rare conditions.

---

## 🙏 Acknowledgments

- Medical symptom data compiled from public health resources
- scikit-learn documentation and community
- FastAPI and React communities

---

## 📧 Contact

Project Link: [https://github.com/kdreze/sympthosium](https://github.com/kdreze/sympthosium)

---

<div align="center">
Made with ❤️ for educational purposes
</div>

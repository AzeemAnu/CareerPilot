
# CareerPilot 🚀
### AI-Powered Resume & Job Description Analyzer

CareerPilot is an AI-powered career assistance application that helps job seekers understand how well their resumes align with a job description. It analyzes resume content against job requirements and provides actionable insights to help users identify skill gaps and improve their job readiness.

## ✨ Features

- **Resume Upload:** Upload a PDF resume for analysis.
- **Job Description Analysis:** Evaluate a resume against a target job description.
- **AI-Powered Insights:** Use an AI model through OpenRouter to generate personalized analysis.
- **Skill Gap Identification:** Identify skills and requirements that may need improvement.
- **Actionable Recommendations:** Get guidance to improve alignment with a target role.
- **PDF Text Extraction:** Extract readable text from PDF resumes.
- **Input Validation:** Handle invalid PDF files and enforce upload and text-length limits.
- **Modern Web Interface:** React-based frontend for interacting with the application.

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- HTML5
- CSS3

**Backend**
- Python
- FastAPI
- Uvicorn
- OpenAI Python SDK
- OpenRouter API
- PyMuPDF
- python-dotenv

## 🏗️ Project Structure

```text
CareerPilot/
├── backend/
│   └── main.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── DashboardLayout.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- An OpenRouter API key

### 1. Clone the Repository

```bash
git clone https://github.com/AzeemAnu/CareerPilot.git
cd CareerPilot
```

### 2. Set Up the Backend

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
python -m venv backend/.venv
.\backend\.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install fastapi uvicorn python-dotenv openai PyMuPDF python-multipart
```

### 3. Configure Environment Variables

Create a file named `.env` inside the `backend` folder.

Add your configuration:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
```

Replace the placeholder with your own API key. Never commit your `.env` file or expose your API key publicly.

### 4. Run the Backend

From the project root, run:

```powershell
uvicorn main:app --app-dir backend --reload
```

The API will be available at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

### 5. Run the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

http://localhost:5173

## 🔐 Security

- API keys are stored in environment variables.
- Local environment files are excluded using `.gitignore`.
- Uploaded PDF files are subject to application-level size and page limits.

Never publish API keys, credentials, or private resume data.

## 🎯 Project Objective

CareerPilot aims to make career preparation more focused by helping job seekers compare their existing skills with job requirements and identify areas for improvement.

## 👨‍💻 Author

**AzeemAnu**

GitHub: [@AzeemAnu](https://github.com/AzeemAnu)

---

*Built to help job seekers navigate their career journey with AI.*

# Employee Insight Portal

A full-stack web application for employee churn prediction, analytics, and AI-powered chatbot using RAG (Retrieval-Augmented Generation).

## 🎯 Features

- **Employee Data Management** - View, search, and filter employee records with pagination
- **Churn Prediction** - ML-powered predictions using pre-trained Random Forest/Logistic Regression model
- **RAG Chatbot** - AI assistant for employee-related queries using LangChain + ChromaDB + OpenAI
- **Admin Dashboard** - Interactive charts and KPIs (Recharts)
- **Modern UI** - Clean, accessible design with olive green theme using TailwindCSS

## 🛠 Tech Stack

**Frontend:**
- React 18 (functional components + hooks)
- TailwindCSS (olive green theme)
- React Router v6
- Recharts (data visualization)
- Axios (API calls)

**Backend:**
- FastAPI (Python)
- LangChain (RAG pipeline)
- ChromaDB (vector store)
- OpenAI API (embeddings + LLM)
- scikit-learn (ML inference)
- pandas (data processing)

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Your trained churn model (`churn_model.pkl`)

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend:**
```bash
cd employee-insight-portal/backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

5. **⚠️ IMPORTANT: Add your trained model**
```
Place your churn_model.pkl file in:
backend/models/churn_model.pkl
```

6. **Initialize RAG vector store (first time only):**
```bash
python init_vector_store.py
```

7. **Start backend server:**
```bash
uvicorn app:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd employee-insight-portal/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm start
```

Frontend runs at: `http://localhost:3000`

## 📁 Project Structure

```
employee-insight-portal/
├─ frontend/
│  ├─ public/
│  │  └─ index.html
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ Home.jsx              # Landing page
│  │  │  ├─ EmployeeList.jsx      # Employee table with filters
│  │  │  ├─ EmployeeDetail.jsx    # Individual employee view
│  │  │  ├─ Chatbot.jsx           # RAG chatbot interface
│  │  │  └─ Dashboard.jsx         # Analytics dashboard
│  │  ├─ components/
│  │  │  ├─ Navbar.jsx            # Top navigation
│  │  │  └─ Sidebar.jsx           # Collapsible sidebar
│  │  ├─ App.jsx                  # Main app component
│  │  ├─ index.js                 # Entry point
│  │  └─ index.css                # Tailwind imports
│  ├─ package.json
│  ├─ tailwind.config.js          # Olive green theme
│  └─ postcss.config.js
│
├─ backend/
│  ├─ app.py                      # FastAPI main app
│  ├─ routes/
│  │  ├─ employees.py             # Employee endpoints
│  │  ├─ predict.py               # Churn prediction endpoint
│  │  └─ chatbot.py               # RAG chatbot endpoint
│  ├─ utils/
│  │  ├─ preprocessing.py         # Data preprocessing (matches training)
│  │  └─ rag_pipeline.py          # RAG system with LangChain
│  ├─ models/
│  │  └─ churn_model.pkl          # ⚠️ YOU MUST ADD THIS
│  ├─ data/
│  │  ├─ employees.csv            # Sample employee data
│  │  ├─ company_policies.txt     # Company policies for RAG
│  │  └─ churn_insights.txt       # Churn analysis for RAG
│  ├─ vector_db/                  # ChromaDB persisted store (auto-created)
│  ├─ .env.example                # Environment template
│  ├─ .env                        # Your config (create this)
│  ├─ requirements.txt            # Python dependencies
│  └─ init_vector_store.py        # Vector store initialization script
│
└─ README.md                      # This file
```

## 🔌 API Endpoints

### Health Check
```bash
GET /
GET /health
```

### Employees
```bash
# Get all employees (with filters)
GET /employees?search=john&department=Sales&risk_level=High%20Risk&page=1&limit=10

# Get single employee
GET /employee/{employee_id}
```

### Prediction
```bash
POST /predict
Content-Type: application/json

{
  "employee_id": "E102",
  "tenure": 24,
  "monthly_salary": 5000,
  "performance_score": 3.5,
  "satisfaction_level": 0.7,
  "last_evaluation": 0.8,
  "number_project": 4,
  "average_monthly_hours": 160,
  "time_spend_company": 3,
  "work_accident": 0,
  "promotion_last_5years": 0,
  "department": "Sales",
  "salary_level": "medium"
}
```

### Chatbot
```bash
POST /chat
Content-Type: application/json

{
  "message": "Show employees with high churn risk"
}
```

## 🧪 Testing

Test backend endpoints with curl:

```bash
# Health check
curl http://localhost:8000/health

# Get employees
curl http://localhost:8000/employees

# Get specific employee
curl http://localhost:8000/employee/E101

# Predict churn
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "E102",
    "tenure": 24,
    "monthly_salary": 5000,
    "performance_score": 3.5,
    "satisfaction_level": 0.7,
    "last_evaluation": 0.8,
    "number_project": 4,
    "average_monthly_hours": 160,
    "time_spend_company": 3,
    "work_accident": 0,
    "promotion_last_5years": 0,
    "department": "Sales",
    "salary_level": "medium"
  }'

# Chat with AI
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the churn rate in Sales?"}'
```

## ⚙️ Configuration

### Preprocessing

The `backend/utils/preprocessing.py` file contains the preprocessing logic. **This must match your training notebook exactly:**

- Feature names and order
- Encoding for categorical variables
- Scaling method
- Any transformations applied

### RAG System

The RAG pipeline uses:
- **Documents**: `company_policies.txt`, `churn_insights.txt`, `employees.csv`
- **Embeddings**: OpenAI `text-embedding-ada-002`
- **LLM**: OpenAI `gpt-3.5-turbo`
- **Vector Store**: ChromaDB (persisted in `backend/vector_db/`)

To rebuild the vector store:
```bash
cd backend
python init_vector_store.py
```

## 🎨 UI Features

- **Olive Green Theme**: Professional, calming color palette
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: Good contrast ratios, semantic HTML, keyboard navigation
- **Loading States**: Spinners and skeleton screens
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful messages when no data

## 📊 Dashboard Metrics

- Total employees count
- Average churn probability
- High-risk employee count
- Average satisfaction level
- Churn risk by department (bar chart)
- Risk distribution (pie chart)
- Churn risk by tenure (line chart)
- Employees by department (bar chart)

## 🤖 Chatbot Capabilities

Ask questions like:
- "Show employees with high churn risk"
- "Why is churn higher in sales?"
- "What are the retention strategies?"
- "Who are top performers with low retention risk?"
- "What is the average churn rate by department?"

The chatbot provides:
- Natural language answers
- Source citations
- Context-aware responses

## ⚠️ Important Notes

1. **Model File**: You MUST place `churn_model.pkl` in `backend/models/` before running
2. **Preprocessing**: Ensure `preprocessing.py` matches your training notebook exactly
3. **OpenAI API Key**: Required for chatbot functionality
4. **Vector Store**: Built on first run, persisted for subsequent runs
5. **CORS**: Backend allows requests from `http://localhost:3000` only

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Verify all dependencies installed
- Ensure `churn_model.pkl` exists in `backend/models/`

**Chatbot not working:**
- Verify `OPENAI_API_KEY` in `.env` file
- Check OpenAI API quota/billing
- Run `init_vector_store.py` to rebuild vector store

**Frontend can't connect:**
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify API_URL in frontend code

**Prediction errors:**
- Check preprocessing matches training
- Verify all required features are present
- Check model file integrity

## 📝 License

This project is for educational/demonstration purposes.

## 🤝 Contributing

This is a complete full-stack template. Customize as needed for your use case.

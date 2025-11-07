from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import employees, predict, chatbot

app = FastAPI(title="Employee Insight Portal API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(predict.router)
app.include_router(chatbot.router)

@app.get("/")
def root():
    return {
        "message": "Employee Insight Portal API",
        "version": "1.0.0",
        "endpoints": {
            "employees": "/employees",
            "employee_detail": "/employee/{id}",
            "predict": "/predict",
            "chat": "/chat"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

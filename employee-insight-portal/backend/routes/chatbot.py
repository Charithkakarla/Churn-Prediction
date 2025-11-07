from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

# Configure Gemini
api_key = os.getenv("OPENAI_API_KEY")  # Using same env var
if api_key:
    genai.configure(api_key=api_key)

# Load embedding model (cached)
embedding_model = None

def get_embedding_model():
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return embedding_model

# RAG Knowledge Base
def load_knowledge_base():
    """Load and prepare knowledge base from files"""
    knowledge = []
    
    # Load company policies
    try:
        with open('./data/company_policies.txt', 'r', encoding='utf-8') as f:
            content = f.read()
            # Split into sections
            sections = content.split('\n\n')
            for section in sections:
                if len(section.strip()) > 50:
                    knowledge.append({
                        'content': section.strip(),
                        'source': 'company_policies.txt'
                    })
    except:
        pass
    
    # Load churn insights
    try:
        with open('./data/churn_insights.txt', 'r', encoding='utf-8') as f:
            content = f.read()
            sections = content.split('\n\n')
            for section in sections:
                if len(section.strip()) > 50:
                    knowledge.append({
                        'content': section.strip(),
                        'source': 'churn_insights.txt'
                    })
    except:
        pass
    
    # Load employee data summary
    try:
        df = pd.read_csv('./data/employees.csv')
        
        # Overall stats
        total_employees = len(df)
        high_risk = len(df[df['status'] == 'High Risk'])
        medium_risk = len(df[df['status'] == 'Medium Risk'])
        low_risk = len(df[df['status'] == 'Low Risk'])
        avg_churn = df['churn_probability'].mean()
        
        knowledge.append({
            'content': f"""Employee Statistics:
Total Employees: {total_employees}
High Risk: {high_risk} ({high_risk/total_employees*100:.1f}%)
Medium Risk: {medium_risk} ({medium_risk/total_employees*100:.1f}%)
Low Risk: {low_risk} ({low_risk/total_employees*100:.1f}%)
Average Churn Probability: {avg_churn:.1%}""",
            'source': 'employees.csv'
        })
        
        # Department stats
        dept_stats = df.groupby('department').agg({
            'churn_probability': 'mean',
            'employee_id': 'count',
            'satisfaction_level': 'mean'
        }).round(3)
        
        for dept in dept_stats.index:
            knowledge.append({
                'content': f"""Department: {dept}
Employees: {dept_stats.loc[dept, 'employee_id']}
Average Churn Risk: {dept_stats.loc[dept, 'churn_probability']:.1%}
Average Satisfaction: {dept_stats.loc[dept, 'satisfaction_level']:.1%}""",
                'source': 'employees.csv'
            })
        
        # High risk employees
        high_risk_df = df[df['status'] == 'High Risk'].head(10)
        if len(high_risk_df) > 0:
            high_risk_list = ', '.join(high_risk_df['employee_id'].tolist())
            knowledge.append({
                'content': f"High Risk Employees (sample): {high_risk_list}",
                'source': 'employees.csv'
            })
    except:
        pass
    
    return knowledge

def retrieve_relevant_context(query: str, knowledge_base: list, top_k: int = 3):
    """Retrieve most relevant documents using embeddings"""
    model = get_embedding_model()
    
    # Encode query
    query_embedding = model.encode([query])
    
    # Encode all documents
    doc_texts = [doc['content'] for doc in knowledge_base]
    doc_embeddings = model.encode(doc_texts)
    
    # Calculate similarity
    similarities = cosine_similarity(query_embedding, doc_embeddings)[0]
    
    # Get top k
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    
    relevant_docs = []
    for idx in top_indices:
        if similarities[idx] > 0.2:  # Threshold
            relevant_docs.append({
                'content': knowledge_base[idx]['content'],
                'source': knowledge_base[idx]['source'],
                'score': float(similarities[idx])
            })
    
    return relevant_docs

@router.post("/chat")
def chat(request: ChatRequest):
    """Chat with RAG-powered Gemini AI assistant"""
    try:
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if not api_key:
            return {
                "response": "⚠️ API key not configured. Please add your Gemini API key to the .env file.",
                "sources": []
            }
        
        # Load knowledge base
        knowledge_base = load_knowledge_base()
        
        # Retrieve relevant context using RAG
        relevant_docs = retrieve_relevant_context(request.message, knowledge_base, top_k=3)
        
        # Build context from retrieved documents
        context_parts = []
        sources = []
        
        for doc in relevant_docs:
            context_parts.append(doc['content'])
            sources.append({
                'source': doc['source'],
                'content': doc['content'][:200] + '...' if len(doc['content']) > 200 else doc['content']
            })
        
        context = '\n\n'.join(context_parts)
        
        # Create prompt with RAG context
        prompt = f"""You are an AI assistant for an Employee Insight Portal. Use the following context to answer the user's question.

Context:
{context}

User Question: {request.message}

Answer the question based on the context provided. Be helpful, concise, and accurate."""

        # Use Gemini with RAG context
        model_names = ['gemini-2.0-flash-exp', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro']
        response = None
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                break
            except Exception:
                continue
        
        if not response:
            raise Exception("No available Gemini model found")
        
        return {
            "response": response.text,
            "sources": sources
        }
    
    except Exception as e:
        return {
            "response": f"Sorry, I encountered an error: {str(e)}",
            "sources": []
        }

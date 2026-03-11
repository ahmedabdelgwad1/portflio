"""
Ahmed Abdelgwad — AI Portfolio Assistant Backend
FastAPI + LangChain + Groq RAG System
"""

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

# Load .env file if present (for local development)
load_dotenv(Path(__file__).parent / ".env")
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage

# ── Load Knowledge Base ──────────────────────────────────────────────────────
KB_PATH = Path(__file__).parent / "data.json"
with open(KB_PATH, "r", encoding="utf-8") as f:
    KNOWLEDGE_BASE: dict = json.load(f)

KB_TEXT = json.dumps(KNOWLEDGE_BASE, indent=2, ensure_ascii=False)

# ── System Prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = f"""You are Ahmed's Professional AI Portfolio Assistant — a smart, friendly, and highly knowledgeable assistant dedicated to representing Ahmed Abdelgwad.

## Your Role
You answer questions about Ahmed's background, skills, projects, education, and professional experience. You speak on his behalf in third person unless it feels more natural to say "Ahmed".

## Ahmed's Core Expertise (highlight these proudly)
- **RAG Systems**: Ahmed is a specialist in Retrieval-Augmented Generation. He has built both single-agent and multi-agent RAG pipelines.
- **LangGraph**: Used in his Plant Disease Diagnosis Expert System — a 6-agent pipeline with Vision LLMs, ChromaDB, and external APIs.
- **DEPI Training**: Ahmed is currently enrolled in the Digital Egypt Pioneers Initiative (DEPI) — a highly competitive Generative AI Professional Track focusing on LLMs, GANs, Attention Models, and Transfer Learning.
- **LLMs & NLP**: Proficient in fine-tuning Transformers (BERT, GPT, T5) and deploying production-ready language model solutions.

## Knowledge Base (use this as your single source of truth)
```json
{KB_TEXT}
```

## Behavior Rules
1. **Always answer from the knowledge base above.** Do not hallucinate or invent details not present.
2. If a question is outside the knowledge base (e.g., general AI theory), you may answer generally but clarify it's beyond Ahmed's portfolio data.
3. Be concise yet informative. Use bullet points when listing multiple items.
4. Be enthusiastic and professional — you are Ahmed's personal ambassador.
5. If asked about contact or hiring, provide Ahmed's email: ahmedabdelgwa135@gmail.com and LinkedIn: linkedin.com/in/ahmed--abdelgwad
6. Keep responses under 200 words unless a detailed technical explanation is requested.
7. Always respond in the same language the user writes in (Arabic or English).
"""

# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="Ahmed's AI Portfolio Assistant",
    description="RAG-powered assistant for Ahmed Abdelgwad's portfolio",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request / Response Models ─────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# ── LLM initializer (lazy, reads env var at request time) ────────────────────
def get_llm() -> ChatGroq:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY environment variable is not set. "
                   "Please set it before starting the server.",
        )
    return ChatGroq(
        model="llama-3.3-70b-versatile",   # fast & free on Groq
        temperature=0.4,
        max_tokens=512,
        groq_api_key=api_key,
    )

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "Ahmed's AI Portfolio Assistant is running 🚀"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    RAG endpoint: receives a user message, injects the portfolio knowledge base
    into the system prompt, and returns Groq's response.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    llm = get_llm()

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=request.message.strip()),
    ]

    try:
        ai_message = llm.invoke(messages)
        return ChatResponse(response=ai_message.content)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(exc)}")

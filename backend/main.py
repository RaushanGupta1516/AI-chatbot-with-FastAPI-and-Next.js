from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chat import get_ai_response
import uuid

app = FastAPI()

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    message: str
    personality: str

class ChatResponse(BaseModel):
    reply: str
    session_id: str

@app.get("/")
def home():
    return {"status": "✅ Chatbot API Running"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    reply = get_ai_response(
        session_id=request.session_id,
        message=request.message,
        personality=request.personality
    )
    return ChatResponse(
        reply=reply,
        session_id=request.session_id
    )

@app.get("/history/{session_id}")
def get_history(session_id: str):
    from database import chats_collection
    session = chats_collection.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )
    if session:
        return session
    return {"messages": []}

@app.post("/new-session")
def new_session():
    return {"session_id": str(uuid.uuid4())}
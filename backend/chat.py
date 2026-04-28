from langchain_mistralai import ChatMistralAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from database import chats_collection
from dotenv import load_dotenv

load_dotenv()

model = ChatMistralAI(
    model="mistral-small-2603",
    temperature=0.9
)

personalities = {
    "funny": """You are a VERY funny assistant.
Every answer must contain humor, jokes and exaggeration.
Be playful and entertaining in every response.""",

    "serious": """You are a serious professional assistant.
Use formal tone only.
No jokes.
Be precise and structured.""",

    "angry": """You are an angry assistant.
Respond in an irritated and sharp tone.
Sound annoyed but still answer correctly."""
}

def get_ai_response(session_id: str, message: str, personality: str):

    # Get existing session from MongoDB
    session = chats_collection.find_one({"session_id": session_id})

    if session:
        previous_personality = session.get("personality", personality)

        # ✅ KEY FIX
        # If personality changed → reset history
        if previous_personality != personality:
            history = []
        else:
            history = session["messages"]
    else:
        history = []

    # Build system prompt
    system_prompt = personalities.get(
        personality,
        "You are a helpful assistant."
    )

    # Build messages list
    messages = [SystemMessage(content=system_prompt)]

    for msg in history:
        if msg["role"] == "human":
            messages.append(HumanMessage(content=msg["content"]))
        else:
            messages.append(AIMessage(content=msg["content"]))

    messages.append(HumanMessage(content=message))

    # Call Mistral
    response = model.invoke(messages)
    reply = response.content

    # Save updated history to MongoDB
    new_history = history + [
        {"role": "human", "content": message},
        {"role": "ai", "content": reply}
    ]

    chats_collection.update_one(
        {"session_id": session_id},
        {"$set": {
            "session_id": session_id,
            "messages": new_history,
            "personality": personality
        }},
        upsert=True
    )

    return reply
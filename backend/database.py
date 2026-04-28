
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["chatbot_db"]
chats_collection = db["chats"]
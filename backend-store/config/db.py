from pymongo import ASCENDING, MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017") 
client = MongoClient(MONGO_URL)
db = client["Movie_db"]


db.movies.create_index([("mov_id", ASCENDING), ("director", ASCENDING)], unique=True)
db.movies.create_index([("mov_name", ASCENDING), ("director", ASCENDING)], unique=True)
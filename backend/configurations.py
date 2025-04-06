from pymongo.mongo_client import MongoClient

uri = "mongodb://localhost:27017"

client = MongoClient(uri)

db = client.user_db
user_col = db["user_collection"]
project_col = db["project_collection"]
devices_col = db["devices_collection"]
chart_col = db["chart_collection"]

import uvicorn
from fastapi import FastAPI
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient
from routes.auth import auth_router
from routes.chart import chart_router
from routes.devices import device_router
from routes.gauge import gauge_router
from routes.project import project_router
from routes.user import user_router

app = FastAPI()


uri = "mongodb://localhost:27017"
client = MongoClient(uri)

try:
    client.admin.command("ping")
    print("Connection Successful")
except ConnectionFailure:
    print("Failed to connect to Mongodb Server")

app.include_router(device_router)
app.include_router(project_router)
app.include_router(user_router)
app.include_router(chart_router)
app.include_router(auth_router)
app.include_router(gauge_router)


if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=8000)

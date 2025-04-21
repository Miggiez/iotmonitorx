from contextlib import asynccontextmanager
from typing import Any

import configurations
import uvicorn
from configurations import fast_mq
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from gmqtt import Client as MQTTClient
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient

INFLUXDB_HOST = "influxdb1"
INFLUXDB_PORT = 8086


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    await fast_mq.mqtt_startup()
    yield
    await fast_mq.mqtt_shutdown()


app = FastAPI(lifespan=_lifespan)
# app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def split_topic(topic: str):
    components = topic.split("/")
    user_id = components[1]
    dev_id = components[2]
    sens = components[3]
    return user_id, dev_id, sens


@fast_mq.on_connect()
def connect(client: MQTTClient, flags: int, rc: int, properties: Any):
    print("Connected")


@fast_mq.on_disconnect()
def disconnect(client: MQTTClient, packet, exc=None):
    print("Disconnected")


uri = "mongodb://localhost:27018"
client = MongoClient(uri)

try:
    client.admin.command("ping")
    print("Connection Successful")
except ConnectionFailure:
    print("Failed to connect to Mongodb Server")

if configurations.client:
    try:
        from configurations import fast_mq
        from routes.auth import auth_router
        from routes.chart import chart_router
        from routes.devices import device_router
        from routes.gauge import gauge_router
        from routes.logs import log_router
        from routes.project import project_router
        from routes.switch import switch_router
        from routes.user import user_router

        app.include_router(device_router)
        app.include_router(project_router)
        app.include_router(user_router)
        app.include_router(chart_router)
        app.include_router(auth_router)
        app.include_router(gauge_router)
        app.include_router(log_router)
        app.include_router(switch_router)
    except ConnectionFailure:
        print("Failed to connect to MongoDB Server")
    except Exception as e:
        print(f"Error including routers: {e}")


if __name__ == "__main__":
    uvicorn.run(app=app, host="0.0.0.0", port=8000)

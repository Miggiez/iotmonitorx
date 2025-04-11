from contextlib import asynccontextmanager
from typing import Any

import uvicorn
from fastapi import FastAPI
from fastapi_mqtt import FastMQTT, MQTTConfig
from gmqtt import Client as MQTTClient
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient
from routes.auth import auth_router
from routes.chart import chart_router
from routes.devices import device_router
from routes.gauge import gauge_router
from routes.project import project_router
from routes.user import user_router

mqtt_config = MQTTConfig(host="127.0.0.1", port=1883, keepalive=60)
fast_mqtt = FastMQTT(config=mqtt_config)


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    await fast_mqtt.mqtt_startup()
    yield
    await fast_mqtt.mqtt_shutdown()


app = FastAPI(lifespan=_lifespan)


@fast_mqtt.on_connect()
def connect(client: MQTTClient, flags: int, rc: int, properties: Any):
    client.subscribe("/#")  # subscribing mqtt topic
    print("Connected: ", client, flags, rc, properties)


@fast_mqtt.on_message()
async def message(
    client: MQTTClient, topic: str, payload: bytes, qos: int, properties: Any
):
    print("Received message: ", topic, payload.decode(), qos, properties)


@fast_mqtt.on_disconnect()
def disconnect(client: MQTTClient, packet, exc=None):
    print("Disconnected")


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

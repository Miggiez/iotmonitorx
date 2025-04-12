import json
from contextlib import asynccontextmanager
from typing import Any

import uvicorn
from bson import ObjectId
from configurations import devices_col, user_col
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

from influxdb import InfluxDBClient, exceptions

mqtt_config = MQTTConfig(host="127.0.0.1", port=1883, keepalive=60)
fast_mqtt = FastMQTT(config=mqtt_config)

INFLUXDB_HOST = "127.0.0.1"
INFLUXDB_PORT = 8086


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    await fast_mqtt.mqtt_startup()
    yield
    await fast_mqtt.mqtt_shutdown()


app = FastAPI(lifespan=_lifespan)


def influx_connection():
    influx = InfluxDBClient(host=INFLUXDB_HOST, port=INFLUXDB_PORT, timeout=5)
    try:
        influx.ping()
    except exceptions.InfluxDBClientError:
        raise ConnectionError("Failed to connect to influxDB server")

    return influx


def split_topic(topic: str):
    components = topic.split("/")
    user_id = components[0]
    dev_id = components[2]
    sens_id = components[3]
    print(components)
    return user_id, dev_id, sens_id


def create_database(db_name: str, influx: InfluxDBClient):
    influx.create_database(db_name)


def is_json(payload):
    try:
        parsed = json.loads(payload)
        # Ensure the parsed object is a dictionary or a list
        if isinstance(parsed, (dict, list)):
            return True
        else:
            return False
    except (json.JSONDecodeError, TypeError):
        return False


def create_measurement(
    database_name, measurement_name, field_name="value", field_value=1
):
    client.switch_database(database_name)

    json_body = [{"measurement": measurement_name, "fields": {field_name: field_value}}]
    client.write_points(json_body)


def create_measurement_json(database_name, measurement_name, json_field):
    client.switch_database(database_name)

    if not isinstance(json_field, dict):
        raise ValueError("json_field must be a dictionary.")

    json_body = [{"measurement": measurement_name, "fields": json_field}]
    client.write_points(json_body)


@fast_mqtt.on_connect()
def connect(client: MQTTClient, flags: int, rc: int, properties: Any):
    client.subscribe("/#")  # subscribing mqtt topic
    print("Connected: ", client, flags, rc, properties)


@fast_mqtt.on_message()
async def message(
    client: MQTTClient, topic: str, payload: bytes, qos: int, properties: Any
):
    influx = influx_connection()
    user_id, dev_id, sens_id = split_topic(topic)
    user = user_col.find_one({"_id": ObjectId(user_id)})
    device = devices_col.find_one({"_id": ObjectId(dev_id)})
    try:
        if user:
            influx.create_database(user_id)
            if not device:
                raise "There is no such device"
    except Exception as e:
        print(e)
    try:
        topic_components = split_topic(topic)
        if not is_json(payload):
            payload2 = payload.decode("utf-8")
            print(topic + ":" + payload2)
            create_measurement(
                topic_components[0], topic_components[1], topic_components[2], payload
            )
        else:
            payload = json.loads(payload)
            create_measurement_json(topic_components[0], topic_components[1], payload)

    except Exception as e:
        print(e)


@fast_mqtt.on_disconnect()
def disconnect(client: MQTTClient, packet, exc=None):
    print("Disconnected")


uri = "mongodb://localhost:27018"
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

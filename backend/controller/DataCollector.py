import json
from contextlib import asynccontextmanager
import os
from typing import Any

import uvicorn
from bson import ObjectId
from configurations import devices_col, fast_mq, influx_connection, user_col
from fastapi import FastAPI
from gmqtt import Client as MQTTClient
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient
from routes.auth import auth_router
from routes.chart import chart_router
from routes.devices import device_router
from routes.gauge import gauge_router
from routes.project import project_router
from routes.user import user_router

from influxdb import InfluxDBClient

INFLUXDB_HOST = "influxdb1"
INFLUXDB_PORT = 8086


# uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
uri = "mongodb://mongodb1:27017"  #
client = MongoClient(uri)

try:
    client.admin.command("ping")
    print("Connection Successful")
except ConnectionFailure:
    print("Failed to connect to Mongodb Server")






def split_topic(topic: str):
    components = topic.split("/")
    user_id = components[1]
    dev_id = components[2]
    sens = components[3]
    return user_id, dev_id, sens


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


def create_measurement_json(
    influx: InfluxDBClient, database_name, measurement_name, json_field
):
    influx.switch_database(database_name)

    if not isinstance(json_field, dict):
        raise ValueError("json_field must be a dictionary.")

    json_body = [{"measurement": measurement_name, "fields": json_field}]
    influx.write_points(json_body)


@fast_mq.on_connect()
def connect(client: MQTTClient, flags: int, rc: int, properties: Any):
    client.subscribe("/#")  # subscribing mqtt topic
    print("Connected: ", client, flags, rc, properties)


@fast_mq.on_message()
async def message(
    client: MQTTClient, topic: str, payload: bytes, qos: int, properties: Any
):
    influx = influx_connection()
    user_id, dev_id, sens = split_topic(topic)
    user = user_col.find_one({"_id": ObjectId(user_id)})
    device = devices_col.find_one({"_id": ObjectId(dev_id)})

    if user:
        if device:
            influx.create_database(user_id)
        else:
            print("There is no such device")
            return
    else:
        print("There is no user with this id")
        return

    try:
        if is_json(payload):
            payload = json.loads(payload)
            create_measurement_json(influx, user_id, dev_id, payload)

    except Exception as e:
        print(e)


@fast_mq.on_disconnect()
def disconnect(client: MQTTClient, packet, exc=None):
    print("Disconnected")
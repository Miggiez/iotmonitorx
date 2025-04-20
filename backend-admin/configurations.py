from fastapi_mqtt import FastMQTT, MQTTConfig
from pymongo.mongo_client import MongoClient
from pymongo.errors import ConnectionFailure
from influxdb import InfluxDBClient, exceptions
import os


INFLUXDB_HOST = "influxdb1"
INFLUXDB_PORT = "8086"

Mqtt_BROKER_HOST = "mqtt1"
Mqtt_BROKER_PORT = "1883"

Mongodb_uri ="mongodb://mongodb1:27017"

mqtt_config = MQTTConfig(host=Mqtt_BROKER_HOST, port=Mqtt_BROKER_PORT, keepalive=60)
fast_mq = FastMQTT(config=mqtt_config)


def influx_connection():
    influx = InfluxDBClient(host=INFLUXDB_HOST, port=INFLUXDB_PORT, timeout=5)
    try:
        influx.ping()
    except exceptions.InfluxDBClientError:
        raise ConnectionError("Failed to connect to influxDB server")

    return influx


# uri =os.environ.get("Mqtt_BROKER_HOST", "mongodb://localhost:27017")


def check_db_connection():
    try:
        client = MongoClient(Mongodb_uri, serverSelectionTimeoutMS=2000)
        # Triggering a command to check connection
        client.admin.command('ping')
        print("MongoDB is running!")
        return client
    except ConnectionFailure:
        print("Error: MongoDB is not running!")

client=check_db_connection()
if client:
    db = client.user_db
    influx=influx_connection()
    user_col = db["user_collection"]
    project_col = db["project_collection"]
    devices_col = db["devices_collection"]
    gauge_col = db["gauge_collection"]
    logs_col = db["logs_collection"]
    chart_col = db["chart_collection"]

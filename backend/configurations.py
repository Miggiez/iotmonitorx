from fastapi_mqtt import FastMQTT, MQTTConfig
from pymongo.mongo_client import MongoClient

from influxdb import InfluxDBClient, exceptions

INFLUXDB_HOST = "127.0.0.1"
INFLUXDB_PORT = 8086

mqtt_config = MQTTConfig(host="127.0.0.1", port=1883, keepalive=60)
fast_mq = FastMQTT(config=mqtt_config)


def influx_connection():
    influx = InfluxDBClient(host=INFLUXDB_HOST, port=INFLUXDB_PORT, timeout=5)
    try:
        influx.ping()
    except exceptions.InfluxDBClientError:
        raise ConnectionError("Failed to connect to influxDB server")

    return influx


uri = "mongodb://localhost:27018"

client = MongoClient(uri)

db = client.user_db
user_col = db["user_collection"]
project_col = db["project_collection"]
devices_col = db["devices_collection"]
gauge_col = db["gauge_collection"]
logs_col = db["logs_collection"]
chart_col = db["chart_collection"]
switch_col = db["switch_collection"]

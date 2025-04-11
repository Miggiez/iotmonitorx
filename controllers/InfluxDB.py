# InfluxDb.py

# from ..forms import InfluxDBForm
import asyncio
import logging

from influxdb import InfluxDBClient

# InfluxDB client initialization
# INFLUXDB_HOST = '192.168.1.102'
INFLUXDB_HOST = "127.0.0.1"
INFLUXDB_PORT = 8087

# def connectConnection(host='192.168.1.104',port=8086):


def connectConnection(host=INFLUXDB_HOST, port=INFLUXDB_PORT):
    global client
    client = InfluxDBClient(host, port, timeout=5)
    try:
        # Attempt to ping the server to verify connection
        client.ping()
    except Exception:
        # Raise an error if connection is unsuccessful
        raise ConnectionError("Failed to connect to InfluxDB server.")

    return client


async def async_connectConnection(host=INFLUXDB_HOST, port=INFLUXDB_PORT):
    """Asynchronously connect to the InfluxDB server."""
    global client
    client = InfluxDBClient(host, port, timeout=5)
    try:
        await asyncio.to_thread(client.ping)
    except Exception:
        raise ConnectionError("Failed to connect to InfluxDB server.")
    return client


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_database(db_name):
    """Create a new database in InfluxDB."""
    client.create_database(db_name)
    logger.info("Database created: %s", db_name)


async def async_create_database(db_name):
    """Asynchronously create a new database in InfluxDB."""
    await asyncio.to_thread(client.create_database, db_name)
    logger.info("Database created: %s", db_name)


def createRetentionPolicy(db_name, duration):
    client.create_retention_policy(
        name=db_name, database=db_name, duration=duration, replication=1
    )


def alterRetentionPolicy(db_name, duration):
    client.alter_retention_policy(
        name=db_name, database=db_name, duration=duration, replication=1
    )


def delete_database(db_name):
    """Delete a database from InfluxDB."""
    client.drop_database(db_name)
    logger.info("Database deleted: %s", db_name)


async def async_delete_database(db_name):
    """Asynchronously delete a database from InfluxDB."""
    await asyncio.to_thread(client.drop_database, db_name)
    logger.info("Database deleted: %s", db_name)


def list_databases():
    """List all existing databases in InfluxDB."""
    try:
        databases = client.get_list_database()
        return [db["name"] for db in databases]
    except Exception as e:
        logger.error("Error retrieving databases: %s", str(e))
        return []


async def async_list_databases():
    """Asynchronously list all existing databases in InfluxDB."""
    try:
        databases = await asyncio.to_thread(client.get_list_database)
        return [db["name"] for db in databases]
    except Exception as e:
        logger.error("Error retrieving databases: %s", str(e))
        return []


def create_measurement(
    database_name, measurement_name, field_name="value", field_value=1
):
    client.switch_database(database_name)

    json_body = [{"measurement": measurement_name, "fields": {field_name: field_value}}]
    client.write_points(json_body)
    logger.info(
        f"Measurement {measurement_name} created in database {database_name} with field {field_name}: {field_value}"
    )


def create_measurement_json(database_name, measurement_name, json_field):
    client.switch_database(database_name)

    if not isinstance(json_field, dict):
        raise ValueError("json_field must be a dictionary.")

    json_body = [{"measurement": measurement_name, "fields": json_field}]
    client.write_points(json_body)
    logger.info(
        f"Measurement {measurement_name} created in database {database_name} with field"
    )


async def async_create_measurement(
    database_name, measurement_name, field_name="value", field_value=1
):
    """Asynchronously create a new measurement in a database."""
    await asyncio.to_thread(client.switch_database, database_name)
    json_body = [{"measurement": measurement_name, "fields": {field_name: field_value}}]
    await asyncio.to_thread(client.write_points, json_body)
    logger.info(
        f"Measurement {measurement_name} created in database {database_name} with field {field_name}: {field_value}"
    )


def get_list(database_name, measurement_name, query: str):
    client.switch_database(database_name)
    return client.query(query)


def list_measurements(database):
    """List measurements for a specific database."""
    client.switch_database(database)
    query = "SHOW MEASUREMENTS"
    results = client.query(query)
    return [point["name"] for point in results.get_points()]


def get_columns(database, measurement):
    """Get columns of a specific measurement."""
    client.switch_database(database)
    query = f'SHOW FIELD KEYS FROM "{measurement}"'
    results = client.query(query)
    return [point["fieldKey"] for point in results.get_points()]


async def async_get_list(database_name, measurement_name, query: str):
    """Asynchronously execute a query on a database."""
    await asyncio.to_thread(client.switch_database, database_name)
    return await asyncio.to_thread(client.query, query)


if __name__ == "__main__":
    connectConnection()
    # create_measurement('test5','tst_mes',field_value=5)
    # create_measurement("gwiiot", "tst_mes", field_value=5)

    list_databases()

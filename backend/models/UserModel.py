from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str


class GaugeMeasurements(BaseModel):
    topic: str
    title: str
    max_value: float
    min_value: float
    m_type: str
    unit: str


class ChartMeasurement(BaseModel):
    title: str
    topic: str
    configs: object


class Devices(BaseModel):
    device_name: str
    chart: list[GaugeMeasurements]
    gauge: list[ChartMeasurement]


class Project(BaseModel):
    project_title: str
    devices: list[Devices]

from enum import Enum
from typing import Optional

from pydantic import BaseModel


class GaugeMeasurements(BaseModel):
    topic: str
    title: str
    max_value: float
    min_value: float
    m_type: str
    unit: str
    device_id: str


class ChartMeasurement(BaseModel):
    title: str
    topic: str
    configs: object
    device_id: str


class Devices(BaseModel):
    device_name: str
    charts: Optional[str] = []
    gauges: Optional[str] = []
    project_id: str


class Project(BaseModel):
    title: str
    devices: Optional[str] = []
    user_id: str


class LogEnum(str, Enum):
    message = "message"
    error = "error"


class LeveEnum(str, Enum):
    project = "project"
    device = "devices"
    user = "user"
    chart = "chart"
    gaguge = "gauge"


class Logs(BaseModel):
    title: str
    l_type: LogEnum
    description: str
    level: LeveEnum
    user_id: str


class RoleEnum(str, Enum):
    admin = "admin"
    user = "user"


class User(BaseModel):
    username: str
    password: str
    project: Optional[str] = []
    logs: Optional[str] = []
    role: RoleEnum = RoleEnum.user

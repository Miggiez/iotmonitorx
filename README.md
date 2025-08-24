# IoTMonitorX

A modular, full-stack IoT platform designed to connect and monitor diverse IoT devices in real time. Originally developed as part of the **AT83.01 Internet of Things Technology and Design** course at the **Asian Institute of Technology, Thailand**, this project reflects the collaborative effort of a four-member team — now enhanced and maintained with additional improvements.

## 🌐 Overview

**IoTMonitorX** is a custom-built IoT platform that enables secure, scalable, and flexible integration of any IoT device. It supports real-time data ingestion, visualization, and device management.

## 🧰 Tech Stack

| Layer        | Technology Used                         |
|--------------|------------------------------------------|
| Frontend     | ReactJS + Nginx                         |
| Backend      | FastAPI (admin, core, JWK service)      |
| Messaging    | EMQX MQTT Broker + FastAPI MQTT         |
| Databases    | MongoDB (metadata) + InfluxDB (time-series) |
| Containerization | Docker / Podman                     |
| Orchestration | Docker Compose / Kubernetes (optional) |

## 📦 Architecture

The system is divided into modular services:

- **Frontend**: Built with ReactJS, served via Nginx. Provides a responsive dashboard for device monitoring and management.
- **Backend**:
  - `backend`: Core API service handling device registration, data routing, and user interactions.
  - `backend-admin`: Admin-level APIs for system configuration and broker management.
  - `jwkspoint`: Microservice for JWT/JWK handling, enabling secure MQTT authentication.
- **MQTT Broker**: EMQX is configured for secure, scalable message routing between devices and backend services.
- **Databases**:
  - **MongoDB** stores device metadata and user profiles.
  - **InfluxDB** captures time-series sensor data for efficient querying and visualization.

## 🔐 Security

- JWT-based authentication for MQTT access.
- Modular FastAPI services with scoped access control.
- EMQX configured with TLS and token-based client validation.

## 🚀 Deployment

Supports both local and cloud-native deployment:

- **Local**: Use `docker-compose.yaml` for quick setup.
- **Production**: Kubernetes manifests (`kube.yaml`) available for scalable deployment.

```bash
# Local setup
docker-compose up --build
```
## 📚 Course Context

This project was developed under the course AT83.01 – Internet of Things Technology and Design at Asian Institute of Technology, Thailand. It reflects our team's hands-on exploration of IoT architecture, secure messaging, and scalable design.

## 👥 Contributors

Originally developed by a team of four students. This public version includes improvements and refinements contributed by 

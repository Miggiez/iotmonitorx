import { ChartConfig } from "./components/ui/chart"

const Type_Sensor = {
	humSensor: "humSensor",
	lightSensor: "lightSensor",
	tempSensorC: "tempSensorC",
	tempSensorF: "tempSensorF",
} as const

export type TypeSensor = keyof typeof Type_Sensor

export interface GaugeProps {
	id: string
	title: string
	topic: string
	max_value: number
	min_value: number
	m_type: string
	unit: string
	created_at: string
	updated_at: string
}

export interface ChartProps {
	id: string
	title: string
	topic: string
	name: string
	color: string
	created_at: string
	updated_at: string
}

export interface ProjectProps {
	id: string
	title: string
	devices: Array<DeviceProps>
	created_at: string
	updated_at: string
}

export interface DeviceProps {
	id: string
	device_name: string
	created_at: string
	updated_at: string
}

export interface User {
	userId: string
	username: string
	email: string
	role: string
}

export interface LoginProps {
	email: string
	password: string
}

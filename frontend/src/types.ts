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

export interface SwitchButtonProps {
	id: string
	switch_name: string
	topic: string
	created_at: string
	updated_at: string
}

export interface SwitchButtonFormProps {
	switch_name: string
	topic: string
}

export interface ChartFormProps {
	title: string
	topic: string
	color: string
}

export interface GaugeFormProps {
	topic: string
	title: string
	max_value: number
	min_value: number
	m_type: string
	unit: string
}

export interface LogProps {
	id: string
	l_type: "error" | "message"
	description: string
	level: "project" | "devices" | "user" | "chart" | "chart" | "gauge" | "switch"
	created_at: string
	updated_at: string
}

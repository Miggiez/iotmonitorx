const Type_Sensor = {
	humSensor: "humSensor",
	lightSensor: "lightSensor",
	tempSensorC: "tempSensorC",
	tempSensorF: "tempSensorF",
} as const

// const Unit_Sensor = {
// 	hum: "H%",
// 	tempF: "°F",
// 	tempC: "°C",
// 	lux: "Lux",
// } as const

export type TypeSensor = keyof typeof Type_Sensor
// export type UnitSensor = keyof typeof Unit_Sensor

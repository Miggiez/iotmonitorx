import Gauge from "@/components/gauge"
import LineGraph from "@/components/lineGraph"
import { ChartConfig } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/dashboard/device/$deviceId")({
	component: RouteComponent,
	loader: () => {},
})

function RouteComponent() {
	const { deviceId } = Route.useParams()
	const [configs, setConfigs] = useState<ChartConfig>({
		temp: {
			label: "Temperature",
			color: "black",
		},
		hum: {
			label: "Humidity",
			color: "blue",
		},
	})
	const [dataKeyTypes, setDataKeyTypes] = useState<Array<string>>([
		"temp",
		"hum",
	])

	// const

	const chartData = [
		{ month: "January", temp: 186, hum: 80 },
		{ month: "February", temp: 305, hum: 200 },
		{ month: "March", temp: 237, hum: 120 },
		{ month: "April", temp: 73, hum: 190 },
		{ month: "May", temp: 209, hum: 130 },
		{ month: "June", temp: 214, hum: 140 },
	]

	return (
		<div>
			<h1 className="text-2xl font-bold mb-3">Device {deviceId}</h1>
			<Separator className="mb-10" />
			<div className="flex flex-wrap justify-center space-x-10 space-y-4">
				<Gauge
					title="ESP32 Humidity"
					value={10}
					maxValue={100}
					minValue={0}
					type="Humidity Sensor"
					unit="H%"
				/>
				<Gauge
					title="ESP32 Temp C"
					value={31}
					maxValue={50}
					minValue={-10}
					type="Temperature Sensor C"
					unit="°C"
				/>
				<Gauge
					title="ESP32 Temp F"
					value={80}
					maxValue={122}
					minValue={14}
					type="Temperature Sensor F"
					unit="°F"
				/>
				<Gauge
					title="ESP32 Lux"
					value={150}
					maxValue={300}
					minValue={-32}
					type="Light Sensor"
					unit="Lux"
				/>
				<LineGraph
					title="Lux and Temp"
					data={chartData}
					configs={configs}
					dataKeyTypes={dataKeyTypes}
				/>
			</div>
		</div>
	)
}

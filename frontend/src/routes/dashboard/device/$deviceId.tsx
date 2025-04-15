import { FormGaugesCharts } from "@/components/form-gauges-charts"
import Gauge from "@/components/gauge"
import LineGraph from "@/components/lineGraph"
import { ShareJWT } from "@/components/share-jwt"
import { ChartConfig } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { ChartProps, GaugeProps } from "@/types"
import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"
import { PlusCircle, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/dashboard/device/$deviceId")({
	component: RouteComponent,
	loader: () => {},
})

function RouteComponent() {
	const { deviceId } = Route.useParams()
	// const [configs, setConfigs] = useState<ChartConfig>({
	// 	temp: {
	// 		label: "Temperature",
	// 		color: "black",
	// 	},
	// 	hum: {
	// 		label: "Humidity",
	// 		color: "blue",
	// 	},
	// })
	// const [dataKey, setDataKey] = useState<string>("temp")

	// const chartData = [
	// 	{ month: "January", temp: 186 },
	// 	{ month: "February", temp: 305 },
	// 	{ month: "March", temp: 237 },
	// 	{ month: "April", temp: 73 },
	// 	{ month: "May", temp: 209 },
	// 	{ month: "June", temp: 214 },
	// ]
	const [charts, setCharts] = useState<ChartProps[]>([])

	const [gauges, setGauges] = useState<GaugeProps[]>([])

	const getCharts = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${deviceId}/getall/charts`,
		})
			.then((res) => {
				console.log(res)
				setCharts(res.data)
			})
			.catch((e) => console.log(e.message))
	}

	const getGauges = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${deviceId}/getall/gauges`,
		})
			.then((res) => {
				console.log(res)
				setCharts(res.data)
			})
			.catch((e) => console.log(e.message))
	}

	useEffect(() => {
		getCharts()
		getGauges()
	}, [])

	return (
		<div>
			<div className="flex w-[100%] items-center py-3">
				<h1 className="text-2xl font-bold mb-3">Device {deviceId}</h1>
				<div className="flex gap-6 justify-center items-center ml-auto">
					<ShareJWT />
					<FormGaugesCharts />
					<div className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]">
						<Trash2 className="text-red-400" />
					</div>
				</div>
			</div>
			<Separator className="mb-10" />

			<div className="flex w-[100%] items-center py-3 mt-10">
				<h1 className="text-2xl font-bold mb-3">Gauges</h1>
			</div>
			<Separator className="mb-10" />
			<div className="flex flex-wrap justify-center space-x-10 space-y-4">
				{gauges.map((gauge) => (
					<Gauge
						title={gauge.title}
						topic={gauge.topic}
						maxValue={gauge.max_value}
						minValue={gauge.min_value}
						type={gauge.m_type}
						unit={gauge.unit}
					/>
				))}
			</div>
			<div className="flex w-[100%] items-center py-3 mt-10">
				<h1 className="text-2xl font-bold mb-3">Charts</h1>
			</div>
			<Separator className="mb-10" />
			<div className="flex flex-wrap justify-center space-x-10 space-y-4">
				{charts.map((chart) => (
					<LineGraph
						title={chart.title}
						configs={chart.configs}
						topic="something"
					/>
				))}
			</div>
		</div>
	)
}

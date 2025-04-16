import { GaugeComponent } from "react-gauge-component"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useEffect, useState } from "react"
import axios from "axios"
import { Trash2 } from "lucide-react"
import { useRefreshContext } from "@/store/generalContext"

export default function Gauge({
	id,
	title,
	topic,
	maxValue = 100,
	minValue = 0,
	type = "Humidity Sensor",
	unit = "H%",
	userId,
	deviceId,
}: {
	id: string
	title: string
	topic: string
	maxValue: number
	minValue: number
	type: string
	unit: string
	userId: string
	deviceId: string
}) {
	const [value, setValue] = useState<number>(0)
	const { refresh, setRefresh } = useRefreshContext()
	const handleTextValue = (value: string, unit: string) => {
		return `${value} ${unit}`
	}
	const getGaugeValue = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${userId}/${deviceId}/gauge/${topic}`,
		})
			.then((res) => {
				let top: any[] = Object.values(res.data[0])
				let val: number = top.pop()
				setValue(val)
			})
			.catch((e) => console.log(e.message))
	}

	const deleteGauge = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		await axios({
			method: "delete",
			url: `http://localhost:8000/gauges/delete/${id}`,
		})
			.then((res) => {
				console.log(res.data)
				setRefresh(!refresh)
			})
			.catch((e) => console.log(e.message))
	}

	useEffect(() => {
		const interval = setInterval(() => {
			getGaugeValue()
		}, 2000)
		return () => clearInterval(interval)
	}, [])
	return (
		<Card className="w-[400px]">
			<CardHeader className="flex items-center">
				<CardTitle>{title}</CardTitle>
				<div
					className="text-red-400 ml-auto w-8 cursor-pointer"
					onClick={deleteGauge}
				>
					<Trash2 />
				</div>
			</CardHeader>
			<CardContent>
				<GaugeComponent
					type="semicircle"
					labels={{
						valueLabel: {
							formatTextValue: (value) => handleTextValue(value, unit),
							style: { color: "black", fill: "black", textShadow: "none" },
						},
					}}
					arc={{
						colorArray: ["#00FF15", "#FF2121"],
						padding: 0.02,
						subArcs: [
							{ limit: (maxValue - minValue) * 0.4 },
							{ limit: (maxValue - minValue) * 0.6 },
							{ limit: (maxValue - minValue) * 0.7 },
						],
					}}
					pointer={{ type: "blob", animationDelay: 0 }}
					maxValue={maxValue}
					minValue={minValue}
					value={value}
				/>
			</CardContent>
			<CardFooter className="text-center">{type}</CardFooter>
		</Card>
	)
}

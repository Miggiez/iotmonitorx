import { useEffect, useState } from "react"
import LineGraph from "./lineGraph"
import axios from "axios"
import { ChartProps } from "@/types"

export const ListChart = ({
	deviceId,
	refresh,
	userId,
}: {
	deviceId: string
	refresh: boolean
	userId: string
}) => {
	const [charts, setCharts] = useState<ChartProps[]>([])
	const getCharts = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${deviceId}/getall/charts/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				setCharts(res.data)
			})
			.catch((e) => console.log(e.message))
	}
	useEffect(() => {
		getCharts()
	}, [refresh, deviceId])
	return (
		<div className="flex flex-wrap justify-center space-x-10 space-y-4">
			{charts.map((chart) => (
				<LineGraph
					id={chart.id}
					title={chart.title}
					name={chart.name}
					color={chart.color}
					topic={chart.topic}
					userId={userId}
					deviceId={deviceId}
				/>
			))}
		</div>
	)
}

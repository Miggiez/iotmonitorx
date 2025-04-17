import { GaugeProps } from "@/types"
import Gauge from "./gauge"
import { useEffect, useState } from "react"
import axios from "axios"

export const ListGauge = ({
	deviceId,
	refresh,
	userId,
	fields,
}: {
	deviceId: string
	refresh: boolean
	userId: string
	fields: string[] | null
}) => {
	const [gauges, setGauges] = useState<GaugeProps[]>([])
	const getGauges = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${deviceId}/getall/gauges`,
		})
			.then((res) => {
				setGauges(res.data)
			})
			.catch((e) => console.log(e.message))
	}
	useEffect(() => {
		getGauges()
	}, [refresh, deviceId])

	return (
		<div className="flex flex-wrap justify-center space-x-10 space-y-4">
			{gauges.map((gauge) => (
				<Gauge
					id={gauge.id}
					title={gauge.title}
					topic={gauge.topic}
					maxValue={gauge.max_value}
					minValue={gauge.min_value}
					type={gauge.m_type}
					unit={gauge.unit}
					deviceId={deviceId}
					userId={userId}
					fields={fields}
				/>
			))}
		</div>
	)
}

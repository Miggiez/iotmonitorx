import { authenticate } from "@/api/auth"
import { FormGaugesCharts } from "@/components/form-gauges-charts"
import Gauge from "@/components/gauge"
import LineGraph from "@/components/lineGraph"
import { ListGauge } from "@/components/list-gauge"
import { ShareJWT } from "@/components/share-jwt"
import { ChartConfig } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { useRefreshContext, useUserContext } from "@/store/generalContext"
import { ChartProps, GaugeProps } from "@/types"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import axios from "axios"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/dashboard/$deviceId")({
	beforeLoad: async ({ context }) => ({
		getUserId: async () => await authenticate({ context }),
	}),
	component: RouteComponent,
	loader: async ({ context: { getUserId }, location }) => {
		let deviceId = location.pathname.split("/").pop()
		let userId = await getUserId()
		const res = await axios({
			method: "get",
			url: `http://localhost:8000/devices/${userId}/${deviceId}/getall/fields`,
		})
		const res2 = await axios({
			method: "get",
			url: `http://localhost:8000/devices/get/${deviceId}`,
		})
		return {
			fields: res.data,
			userId: userId,
			device: { id: res2.data.id, deviceName: res2.data.device_name },
		}
	},
})

function RouteComponent() {
	const { deviceId } = Route.useParams()
	const [charts, setCharts] = useState<ChartProps[]>([])
	const fileds: string[] | null = Route.useLoaderData().fields
	const userId: string = Route.useLoaderData().userId
	const device: { id: string; deviceName: string } =
		Route.useLoaderData().device
	const { refresh, setRefresh } = useRefreshContext()
	const navigate = useNavigate()

	const getCharts = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${deviceId}/getall/charts`,
		})
			.then((res) => {
				setCharts(res.data)
			})
			.catch((e) => console.log(e.message))
	}

	const deleteDevice = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		await axios({
			method: "delete",
			url: `http://localhost:8000/devices/delete/${deviceId}/${userId}`,
		})
			.then(() => {
				setRefresh(!refresh)
				navigate({ to: "/dashboard" })
			})
			.catch((e) => console.log(e))
	}

	return (
		<div>
			<div className="flex w-[100%] items-center py-3">
				<div className="flex flex-col">
					<h1 className="text-2xl font-bold mb-1">
						Device: {device.deviceName}
					</h1>
					<h1 className="text-l mb-3">ID: {deviceId}</h1>
				</div>
				<div className="flex gap-6 justify-center items-center ml-auto">
					<ShareJWT deviceId={deviceId} userId={userId} />
					<FormGaugesCharts deviceId={deviceId} fields={fileds} />
					<div
						onClick={deleteDevice}
						className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]"
					>
						<Trash2 className="text-red-400" />
					</div>
				</div>
			</div>
			<Separator className="mb-10" />

			<div className="flex w-[100%] items-center py-3 mt-10">
				<h1 className="text-2xl font-bold mb-3">Gauges</h1>
			</div>
			<Separator className="mb-10" />
			<ListGauge deviceId={deviceId} refresh={refresh} userId={userId} />
			<div className="flex w-[100%] items-center py-3 mt-10">
				<h1 className="text-2xl font-bold mb-3">Charts</h1>
			</div>
			<Separator className="mb-10" />
			<div className="flex flex-wrap justify-center space-x-10 space-y-4">
				{/* {charts.map((chart) => (
					<LineGraph
						title={chart.title}
						configs={chart.configs}
						topic="something"
					/>
				))} */}
			</div>
		</div>
	)
}

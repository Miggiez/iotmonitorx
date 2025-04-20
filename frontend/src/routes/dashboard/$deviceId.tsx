import { authenticate } from "@/api/auth"
import { FormDevicesEdit } from "@/components/form-device-edit"
import { FormGaugesCharts } from "@/components/form-gauges-charts"
import { ListChart } from "@/components/list-chart"
import { ListGauge } from "@/components/list-gauge"
import { ListSwitch } from "@/components/list-switch"
import { ShareJWT } from "@/components/share-jwt"
import { Separator } from "@/components/ui/separator"
import { useRefreshContext } from "@/store/generalContext"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import axios from "axios"
import { Trash2 } from "lucide-react"

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
			url: `http://localhost:8000/devices/get/${deviceId}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		return {
			userId: userId,
			device: { id: res.data.id, deviceName: res.data.device_name },
		}
	},
})

function RouteComponent() {
	const { deviceId } = Route.useParams()
	const userId: string = Route.useLoaderData().userId
	const device: { id: string; deviceName: string } =
		Route.useLoaderData().device
	const { refresh, setRefresh } = useRefreshContext()
	const navigate = useNavigate()

	const deleteDevice = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		await axios({
			method: "delete",
			url: `http://localhost:8000/devices/delete/${deviceId}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
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
					<FormGaugesCharts deviceId={deviceId} />
					<FormDevicesEdit deviceId={deviceId} />
					<div
						onClick={deleteDevice}
						className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]"
					>
						<Trash2 className="text-red-400" />
					</div>
				</div>
			</div>
			<Separator className="mb-10" />
			<ListSwitch deviceId={deviceId} refresh={refresh} userId={userId} />
			<div className="flex w-[100%] items-center py-3 mt-10">
				<h1 className="text-2xl font-bold mb-3">Gauges</h1>
			</div>
			<Separator className="mb-10" />
			<ListGauge deviceId={deviceId} refresh={refresh} userId={userId} />
			<div className="flex w-[100%] items-center py-3 mt-10">
				<h1 className="text-2xl font-bold mb-3">Charts</h1>
			</div>
			<Separator className="mb-10" />
			<ListChart deviceId={deviceId} refresh={refresh} userId={userId} />
		</div>
	)
}

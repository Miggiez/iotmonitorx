import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import axios from "axios"
import { Trash2 } from "lucide-react"
import { useRefreshContext } from "@/store/generalContext"
import { SwitchButtonEdit } from "./switch-button-edit"
export function SwitchButton({
	id,
	switchName,
	topic,
	deviceId,
	// fields,
	userId,
}: {
	id: string
	switchName: string
	topic: string
	deviceId: string
	// fields: string[] | null
	userId: string
}) {
	const [val, setVal] = useState<boolean>(false)
	const { refresh, setRefresh } = useRefreshContext()
	const getSwitchValue = async () => {
		if (topic !== "") {
			await axios({
				method: "get",
				url: `/api/devices/${userId}/${deviceId}/switch/${topic}`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
				.then((res) => {
					let top: any[] = Object.values(res.data[0])
					let value: boolean = top.pop()
					setVal(value)
				})
				.catch((e) => console.log("getSwitchValue", e.message))
		}
	}

	const deleteSwitch = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		await axios({
			method: "delete",
			url: `/api/switches/delete/${id}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				console.log(res.data)
				setRefresh(!refresh)
			})
			.catch((e) => console.log("deleteSwitch", e.message))
	}

	const publishSwitch = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (topic !== "") {
			await axios({
				method: "post",
				url: `/api/devices/button/press`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				data: {
					user_id: userId,
					device_id: deviceId,
					name: topic,
					state: !val,
				},
			})
				.then((res) => {
					console.log(res.data)
				})
				.catch((e) => {
					console.log("publishSwitch", e.message)
				})
		}
	}

	useEffect(() => {
		if (topic !== "") {
			const interval = setInterval(() => {
				getSwitchValue()
			}, 100)
			return () => clearInterval(interval)
		}
	}, [refresh])

	return (
		<Card className="w-[300px]">
			<CardHeader className="flex items-center">
				<CardTitle>{switchName}</CardTitle>
				<div className="flex gap-5 items-center ml-auto">
					<SwitchButtonEdit switchId={id} deviceId={deviceId} userId={userId} />
					<div
						className=" text-red-400 w-8 cursor-pointer"
						onClick={deleteSwitch}
					>
						<Trash2 />
					</div>
				</div>
			</CardHeader>
			<CardContent className="cursor-pointer" onClick={publishSwitch}>
				<div className="flex justify-center items-center space-x-5">
					<div className={cn("w-5 h-5 bg-gray-400", val ? "" : "bg-red-400")} />
					<Switch className="cusor-pointer" checked={val} />
					<div
						className={cn(
							"w-5 h-5 bg-gray-400 rounded-[50px]",
							val ? "bg-green-400" : ""
						)}
					/>
				</div>
			</CardContent>
		</Card>
	)
}

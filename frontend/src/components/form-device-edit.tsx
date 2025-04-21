import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRefreshContext, useUserContext } from "@/store/generalContext"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"
import { Edit2 } from "lucide-react"
import { useEffect, useState } from "react"

export function FormDevicesEdit({ deviceId }: { deviceId: string }) {
	const navigate = useNavigate()
	const [deviceName, setDeviceName] = useState<string>("")
	const { user } = useUserContext()
	const [open, setOpen] = useState<boolean>(false)
	const { refresh, setRefresh } = useRefreshContext()
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setDeviceName(e.target.value)
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (deviceName !== "") {
			await axios({
				method: "put",
				url: `/api/devices/edit/${deviceId}/${user.userId}`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				data: {
					device_name: deviceName,
				},
			})
				.then(() => {
					setDeviceName("")
					setRefresh(!refresh)
					navigate({
						to: "/dashboard/$deviceId",
						params: { deviceId: deviceId },
					})
					setOpen(false)
				})
				.catch((e) => console.log(e.response.data.detail))
		}
	}

	const getIndividualDevice = async () => {
		await axios({
			method: "get",
			url: `/api/devices/get/${deviceId}/${user.userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				setDeviceName(res.data.device_name)
			})
			.catch((e) => {
				console.log(e.message)
			})
	}

	useEffect(() => {
		getIndividualDevice()
	}, [])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]">
				<Edit2 className="text-yellow-600" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Device</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="deviceName" className="text-right">
							Device Name
						</Label>
						<Input
							id="deviceName"
							value={deviceName}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						onClick={handleSubmit}
						className="cursor-pointer"
					>
						Edit Device
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

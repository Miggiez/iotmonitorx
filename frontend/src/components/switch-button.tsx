import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import axios from "axios"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog"
import { Edit2, Trash2 } from "lucide-react"
import { Input } from "./ui/input"
import { SwitchButtonFormProps } from "@/types"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"
import { useRefreshContext } from "@/store/generalContext"
import { getAllFields } from "@/api/fields"

export function SwitchButton({
	id,
	switchName,
	topic,
	deviceId,
	userId,
}: {
	id: string
	switchName: string
	topic: string
	deviceId: string
	userId: string
}) {
	const [val, setVal] = useState<boolean>(false)
	const { refresh, setRefresh } = useRefreshContext()
	const getSingleSwitch = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/switches/get/${id}/${userId}`,
		})
			.then((res) => {
				setFormSwitch({
					switch_name: res.data.switch_name,
					topic: res.data.topic,
				})
			})
			.catch((e) => {
				console.log("getSingleSwitch", e.message)
			})
	}
	const [open, setOpen] = useState<boolean>(false)
	const [fields, setFields] = useState<string[] | null>([])
	const getSwitchValue = async () => {
		if (topic !== "") {
			await axios({
				method: "get",
				url: `http://localhost:8000/devices/${userId}/${deviceId}/switch/${topic}`,
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
	const [formSwitch, setFormSwitch] = useState<SwitchButtonFormProps>({
		switch_name: "",
		topic: "",
	})

	const handleSubmitSwitch = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: `http://localhost:8000/switches/create/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data: {
				switch_name: formSwitch.switch_name,
				topic: formSwitch.topic,
				device_id: deviceId,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log("handleSubmitSwitch", e.message))
		setRefresh(!refresh)
		setOpen(false)
		setFormSwitch({
			switch_name: "",
			topic: "",
		})
	}

	const handleFormSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormSwitch({ ...formSwitch, [name]: value })
	}

	const switchEdit = () => {
		return (
			<Dialog
				open={open}
				onOpenChange={async (value) => {
					setOpen(value)
					await getSingleSwitch()
					let data = await getAllFields(userId, deviceId)
					setFields(data)
				}}
			>
				<DialogTrigger className="cursor-pointer">
					<Edit2 className="text-yellow-600" />
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Switch</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Name</Label>
							<Input
								onChange={handleFormSwitchChange}
								value={formSwitch.switch_name}
								name="switch_name"
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label>Topic</Label>
							<Select
								onValueChange={(topic) => {
									setFormSwitch({
										...formSwitch,
										topic: topic,
									})
								}}
								value={formSwitch.topic}
							>
								<SelectTrigger id="topic">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent position="popper">
									{fields &&
										fields.map((field, index) => (
											<SelectItem key={index} value={field}>
												{field}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							onClick={handleSubmitSwitch}
							className="cursor-pointer"
						>
							Edit Switch
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	const deleteSwitch = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		await axios({
			method: "delete",
			url: `http://localhost:8000/switches/delete/${id}/${userId}`,
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
				url: `http://localhost:8000/devices/button/press`,
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

	// useEffect(() => {
	// 	getSingleSwitch()
	// }, [refresh])

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
					{switchEdit()}
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
					<Switch className="cursor-pointer" checked={val} />
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

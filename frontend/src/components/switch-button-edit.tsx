import { Edit2 } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"
import axios from "axios"
import { useState } from "react"
import { SwitchButtonFormProps } from "@/types"
import { getAllFields } from "@/api/fields"
import { useRefreshContext } from "@/store/generalContext"
import { Input } from "./ui/input"

export const SwitchButtonEdit = ({
	switchId,
	userId,
	deviceId,
}: {
	switchId: string
	userId: string
	deviceId: string
}) => {
	const [fields, setFields] = useState<string[] | null>([])
	const { refresh, setRefresh } = useRefreshContext()
	const getSingleSwitch = async () => {
		await axios({
			method: "get",
			url: `/api/switches/get/${switchId}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
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
	const [formSwitch, setFormSwitch] = useState<SwitchButtonFormProps>({
		switch_name: "",
		topic: "",
	})
	const [open, setOpen] = useState<boolean>(false)

	const handleFormSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormSwitch({ ...formSwitch, [name]: value })
	}

	const handleSubmitSwitch = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "put",
			url: `/api/switches/edit/${switchId}/${userId}`,
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

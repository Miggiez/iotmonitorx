import { GaugeComponent } from "react-gauge-component"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useEffect, useState } from "react"
import axios from "axios"
import { Trash2 } from "lucide-react"
import { useRefreshContext } from "@/store/generalContext"
import { Edit2 } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogHeader,
} from "./ui/dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { getAllFields } from "@/api/fields"

interface GaugeProps {
	topic: string
	title: string
	max_value: number
	min_value: number
	m_type: string
	unit: string
}

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
	const [fields, setFields] = useState<string[] | null>([])
	const handleTextValue = (value: string, unit: string) => {
		return `${value} ${unit}`
	}
	const getGaugeValue = async () => {
		await axios({
			method: "get",
			url: `/api/devices/${userId}/${deviceId}/gauge/${topic}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
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
			url: `/api/gauges/delete/${id}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				console.log(res.data)
				setRefresh(!refresh)
			})
			.catch((e) => console.log(e.message))
	}

	const [formGauges, setFormGauges] = useState<GaugeProps>({
		topic: "",
		title: "",
		max_value: 100.0,
		min_value: 0.0,
		m_type: "",
		unit: "",
	})
	const [open, setOpen] = useState<boolean>(false)
	const handleFormGaugeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormGauges({ ...formGauges, [name]: value })
	}
	const handleSubmitGauge = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "put",
			url: `/api/gauges/edit/${id}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data: {
				topic: formGauges.topic,
				title: formGauges.title,
				max_value: formGauges.max_value,
				min_value: formGauges.min_value,
				m_type: formGauges.m_type,
				unit: formGauges.unit,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log(e))
		setRefresh(!refresh)
		setOpen(false)
		setFormGauges({
			topic: "",
			title: "",
			max_value: 100.0,
			min_value: 0.0,
			m_type: "",
			unit: "",
		})
	}

	const gaugeEdit = () => {
		return (
			<Dialog
				open={open}
				onOpenChange={async (value) => {
					setOpen(value)
					await getSingleGauge()
					let data = await getAllFields(userId, deviceId)
					setFields(data)
				}}
			>
				<DialogTrigger className="cursor-pointer">
					<Edit2 className="text-yellow-600" />
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Gauge</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Title</Label>
							<Input
								onChange={handleFormGaugeChange}
								value={formGauges.title}
								name="title"
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label>Topic</Label>
							<Select
								onValueChange={(topic) => {
									setFormGauges({
										...formGauges,
										topic: topic,
									})
								}}
								value={formGauges.topic}
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
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Sensor Type</Label>
							<Input
								onChange={handleFormGaugeChange}
								value={formGauges.m_type}
								name="m_type"
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Max Value</Label>
							<Input
								onChange={handleFormGaugeChange}
								value={formGauges.max_value}
								name="max_value"
								type="number"
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Min Value</Label>
							<Input
								onChange={handleFormGaugeChange}
								value={formGauges.min_value}
								name="min_value"
								type="number"
								className="col-span-3"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">Unit</Label>
							<Input
								onChange={handleFormGaugeChange}
								value={formGauges.unit}
								name="unit"
								className="col-span-3"
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							onClick={handleSubmitGauge}
							className="cursor-pointer"
						>
							Edit Gauge
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	const getSingleGauge = async () => {
		await axios({
			method: "get",
			url: `/api/gauges/get/${id}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				setFormGauges({
					topic: res.data.topic,
					title: res.data.title,
					max_value: res.data.max_value,
					min_value: res.data.min_value,
					m_type: res.data.m_type,
					unit: res.data.unit,
				})
			})
			.catch((e) => {
				console.log(e.response.data.detail)
			})
	}

	// useEffect(() => {
	// 	getSingleGauge()
	// }, [refresh])

	useEffect(() => {
		if (topic !== "") {
			const interval = setInterval(() => {
				getGaugeValue()
			}, 2000)
			return () => clearInterval(interval)
		}
	}, [])
	return (
		<Card className="w-[400px]">
			<CardHeader className="flex items-center">
				<CardTitle>{title}</CardTitle>
				<div className="flex gap-5 items-center ml-auto">
					{gaugeEdit()}
					<div
						className=" text-red-400 w-8 cursor-pointer"
						onClick={deleteGauge}
					>
						<Trash2 />
					</div>
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

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"
import axios from "axios"

interface GaugeProps {
	topic: string
	title: string
	max_value: number
	min_value: number
	m_type: string
	unit: string
}

interface ChartProps {
	title: string
	topic: string
	labelName: string
	name: string
	color: string
}

export function FormGaugesCharts({
	deviceId,
	fields,
}: {
	deviceId: string
	fields: string[] | null
}) {
	const [formGauges, setFormGauges] = useState<GaugeProps>({
		topic: "",
		title: "",
		max_value: 100.0,
		min_value: 0.0,
		m_type: "",
		unit: "",
	})

	const [formCharts, setFormCharts] = useState<ChartProps>({
		title: "",
		topic: "",
		labelName: "",
		name: "",
		color: "black",
	})

	const [selection, setSelection] = useState<string>("gauge")

	const handleFormGaugeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormGauges({ ...formGauges, [name]: value })
	}

	const handleFormChartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormCharts({ ...formCharts, [name]: value })
	}

	const handleReset = () => {
		setFormGauges({
			topic: "",
			title: "",
			max_value: 100.0,
			min_value: 0.0,
			m_type: "",
			unit: "",
		})
		setFormCharts({
			title: "",
			topic: "",
			labelName: "",
			name: "",
			color: "black",
		})
	}

	const handleSubmitGauge = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: `http://localhost:8000/gauges/create`,
			data: {
				topic: formGauges.topic,
				title: formGauges.title,
				max_value: formGauges.max_value,
				min_value: formGauges.min_value,
				m_type: formGauges.m_type,
				unit: formGauges.unit,
				device_id: deviceId,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log(e))
		handleReset()
	}

	const handleSubmitChart = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		handleReset()
	}

	const Gauges = () => {
		return (
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="title" className="text-right">
						Title
					</Label>
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
					<Label htmlFor="mType" className="text-right">
						Sensor Type
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.m_type}
						name="mType"
						className="col-span-3"
						required
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="maxValue" className="text-right">
						Max Value
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.max_value}
						name="maxValue"
						type="number"
						className="col-span-3"
						required
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="minValue" className="text-right">
						Min Value
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.min_value}
						name="minValue"
						type="number"
						className="col-span-3"
						required
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="unit" className="text-right">
						Unit
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.unit}
						name="unit"
						className="col-span-3"
						required
					/>
				</div>
			</div>
		)
	}

	const Charts = () => {
		return (
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="title" className="text-right">
						Title
					</Label>
					<Input
						onChange={handleFormChartChange}
						name="title"
						value={formCharts.title}
						className="col-span-3"
						required
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="labelName" className="text-right">
						Label Name
					</Label>
					<Input
						onChange={handleFormChartChange}
						name="labelName"
						value={formCharts.labelName}
						className="col-span-3"
						required
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label>Topic</Label>
					<Select
						onValueChange={(topic) => {
							setFormCharts({
								...formCharts,
								topic: topic,
							})
						}}
						value={formCharts.topic}
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
					<Label>Color</Label>
					<Select
						onValueChange={(color) => {
							setFormCharts({
								...formCharts,
								color: color,
							})
						}}
						value={formCharts.color}
					>
						<SelectTrigger id="gaugeChart">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectItem value="black">Black</SelectItem>
							<SelectItem value="green">Green</SelectItem>
							<SelectItem value="purple">Purple</SelectItem>
							<SelectItem value="blue">Blue</SelectItem>
							<SelectItem value="red">Red</SelectItem>
							<SelectItem value="orange">Orange</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		)
	}

	return (
		<Dialog>
			<DialogTrigger className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]">
				<PlusCircle className="text-green-400" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Device</DialogTitle>
					<DialogDescription>
						Add a new device to hold your gauges and charts
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col space-y-1.5">
					<Label>Selection</Label>
					<Select
						onValueChange={(value) => {
							setSelection(value)
						}}
						value={selection}
					>
						<SelectTrigger id="gaugeChart">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectItem value="gauge">Gauge</SelectItem>
							<SelectItem value="chart">Chart</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{selection === "gauge" ? Gauges() : Charts()}
				<DialogFooter>
					{selection === "gauge" ? (
						<Button
							type="submit"
							onClick={handleSubmitGauge}
							className="cursor-pointer"
						>
							Create new Gauge
						</Button>
					) : (
						<Button
							type="submit"
							onClick={handleSubmitChart}
							className="cursor-pointer"
						>
							Create new Chart
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

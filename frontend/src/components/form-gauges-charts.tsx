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

interface GaugeProps {
	topic: string
	title: string
	maxValue: number
	minValue: number
	mType: string
	unit: string
}

interface ChartProps {
	title: string
	topic: string
	color: string
}

export function FormGaugesCharts() {
	const [formGauges, setFormGauges] = useState<GaugeProps>({
		topic: "",
		title: "",
		maxValue: 100.0,
		minValue: 0.0,
		mType: "",
		unit: "",
	})

	const [formCharts, setFormCharts] = useState<ChartProps>({
		title: "",
		topic: "",
		color: "black",
	})

	const [numberInput, setNumberInput] = useState<number>(1)
	const [selection, setSelection] = useState<string>("gauge")

	const handleFormGaugeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormGauges({ ...formGauges, [name]: value })
	}

	const handleFormChartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormCharts({ ...formCharts, [name]: value })
	}

	const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setFormGauges({
			topic: "",
			title: "",
			maxValue: 100.0,
			minValue: 0.0,
			mType: "",
			unit: "",
		})
		setFormCharts({
			title: "",
			topic: "",
			color: "black",
		})
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setFormGauges({
			topic: "",
			title: "",
			maxValue: 100.0,
			minValue: 0.0,
			mType: "",
			unit: "",
		})
		setFormCharts({
			title: "",
			topic: "",
			color: "black",
		})
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
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="topic" className="text-right">
						Topic
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.topic}
						name="topic"
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="mType" className="text-right">
						Sensor Type
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.mType}
						name="mType"
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="maxValue" className="text-right">
						Max Value
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.maxValue}
						name="maxValue"
						type="number"
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="minValue" className="text-right">
						Min Value
					</Label>
					<Input
						onChange={handleFormGaugeChange}
						value={formGauges.minValue}
						name="minValue"
						type="number"
						className="col-span-3"
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
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="topic" className="text-right">
						Topic
					</Label>
					<Input
						onChange={handleFormChartChange}
						name="topic"
						value={formCharts.topic}
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label>Color</Label>
					<Select
						onValueChange={(value) => {
							setFormCharts({ ...formCharts, color: value })
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
					<Label htmlFor="framework">Selection</Label>
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
					<Button
						type="button"
						onClick={handleReset}
						className="cursor-pointer"
					>
						Clear
					</Button>
					<Button
						type="submit"
						onClick={handleSubmit}
						className="cursor-pointer"
					>
						{selection === "gauge" ? "Create new Guage" : "Create new Chart"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

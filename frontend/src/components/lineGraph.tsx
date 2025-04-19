import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

import {
	CartesianGrid,
	Label as LabelLine,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "./ui/chart"
import { useEffect, useState } from "react"
import { ChartProps } from "@/types"
import axios from "axios"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"
import { useRefreshContext } from "@/store/generalContext"
import { Edit2, Trash2 } from "lucide-react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogHeader,
} from "./ui/dialog"
import { Button } from "./ui/button"

interface ChartPropsEdit {
	title: string
	topic: string
	name: string
	color: string
}
export default function LineGraph({
	id,
	title,
	name,
	color,
	topic,
	userId,
	deviceId,
	fields,
}: {
	id: string
	title: string
	name: string
	color: string
	topic: string
	userId: string
	deviceId: string
	fields: string[] | null
}) {
	const config: ChartConfig = {
		[name]: {
			label: `${name}`,
			color: `${color}`,
		},
	}
	const [data, setData] = useState<ChartProps[]>([])
	const [time, setTime] = useState<string>("5m")
	const { refresh, setRefresh } = useRefreshContext()

	const [open, setOpen] = useState<boolean>(false)
	const [formCharts, setFormCharts] = useState<ChartPropsEdit>({
		title: "",
		topic: "",
		name: "",
		color: "black",
	})

	const handleFormChartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormCharts({ ...formCharts, [name]: value })
	}

	const handleSubmitChart = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "put",
			url: `http://localhost:8000/charts/edit/${id}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data: {
				title: formCharts.title,
				topic: formCharts.topic,
				name: formCharts.name,
				color: formCharts.color,
				device_id: deviceId,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log(e.message))
		setRefresh(!refresh)
		setOpen(false)
		setFormCharts({
			title: "",
			topic: "",
			name: "",
			color: "black",
		})
	}

	const chartEdit = () => {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger className="cursor-pointer">
					<Edit2 className="text-yellow-600" />
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Chart</DialogTitle>
					</DialogHeader>
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
							<Label htmlFor="name" className="text-right">
								Label Name
							</Label>
							<Input
								onChange={handleFormChartChange}
								name="name"
								value={formCharts.name}
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
					<DialogFooter>
						<Button
							type="submit"
							onClick={handleSubmitChart}
							className="cursor-pointer"
						>
							Edit Chart
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	const getChartsValue = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${userId}/${deviceId}/chart/${topic}/${time}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				setData(res.data)
			})
			.catch((e) => e.message)
	}

	const deleteCharts = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		await axios({
			method: "delete",
			url: `http://localhost:8000/charts/delete/${id}/${userId}`,
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

	const getSingleChart = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/charts/get/${id}/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				setFormCharts({
					title: res.data.title,
					topic: res.data.topic,
					name: res.data.name,
					color: res.data.color,
				})
			})
			.catch((e) => {
				console.log(e)
			})
	}

	useEffect(() => {
		getSingleChart()
	}, [refresh])

	useEffect(() => {
		if (topic !== "") {
			let interval = setInterval(() => {
				getChartsValue()
			}, 2000)
			return () => clearInterval(interval)
		}
	}, [refresh])
	return (
		<Card className="w-[600px]">
			<CardHeader className="flex items-center">
				<CardTitle>{title}</CardTitle>
				<div className="flex gap-5 items-center ml-auto">
					{chartEdit()}
					<div
						className="text-red-400 w-8 cursor-pointer"
						onClick={deleteCharts}
					>
						<Trash2 />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<LineChart
						data={data}
						accessibilityLayer
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<YAxis />
						<XAxis
							dataKey="time"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey={name}
							type="natural"
							stroke={`var(--color-${name})`}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="grid grid-cols-4 items-center gap-4">
					<LabelLine>Time</LabelLine>
					<Select
						onValueChange={(timeVal) => {
							setTime(timeVal)
							setRefresh(!refresh)
						}}
						value={time}
					>
						<SelectTrigger id="topic">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectItem value="5m">5 min</SelectItem>
							<SelectItem value="10m">10 min</SelectItem>
							<SelectItem value="30m">30 min</SelectItem>
							<SelectItem value="1d">1 day</SelectItem>
							<SelectItem value="7d">7 days</SelectItem>
							<SelectItem value="30d">1 month</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardFooter>
		</Card>
	)
}

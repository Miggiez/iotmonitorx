import { ChartFormProps } from "@/types"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"

export function FormCharts({
	setFormCharts,
	formCharts,
	fields,
}: {
	setFormCharts: (newVal: ChartFormProps) => void
	formCharts: ChartFormProps
	fields: string[] | null
}) {
	const handleFormChartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormCharts({ ...formCharts, [name]: value })
	}
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

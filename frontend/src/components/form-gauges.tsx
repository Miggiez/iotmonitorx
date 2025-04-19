import { GaugeFormProps } from "@/types"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"

export function FormGauges({
	formGauges,
	setFormGauges,
	fields,
}: {
	formGauges: GaugeFormProps
	setFormGauges: (newVal: GaugeFormProps) => void
	fields: string[] | null
}) {
	const handleFormGaugeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormGauges({ ...formGauges, [name]: value })
	}

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
					name="m_type"
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
					name="max_value"
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
					name="min_value"
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

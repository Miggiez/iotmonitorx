import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select"
import { SwitchButtonFormProps } from "@/types"

export function FormSwitch({
	formSwitch,
	setFormSwitch,
	fields,
}: {
	formSwitch: SwitchButtonFormProps
	setFormSwitch: (newVal: SwitchButtonFormProps) => void
	fields: string[] | null
}) {
	const handleFormSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormSwitch({ ...formSwitch, [name]: value })
	}
	return (
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
	)
}

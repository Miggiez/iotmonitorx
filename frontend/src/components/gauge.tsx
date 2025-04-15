import { GaugeComponent } from "react-gauge-component"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

export default function Gauge({
	title,
	topic,
	maxValue = 100,
	minValue = 0,
	type = "Humidity Sensor",
	unit = "H%",
}: {
	title: string
	topic: string
	maxValue: number
	minValue: number
	type: string
	unit: string
}) {
	const handleTextValue = (value: string, unit: string) => {
		return `${value} ${unit}`
	}
	return (
		<Card className="w-[400px]">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
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
					// value={value}
				/>
			</CardContent>
			<CardFooter className="text-center">{type}</CardFooter>
		</Card>
	)
}

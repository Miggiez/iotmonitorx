import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "./ui/chart"
import { ChartProps } from "@/types"

export default function LineGraph({
	title,
	configs = { name: "", color: "black" },
	topic,
}: {
	title: string
	configs: { name: string; color: string }
	topic: string
}) {
	const something = JSON.parse(
		`"${configs.name}": {"label":"${configs.name}", color: "${configs.color}"}`
	)
	const config: ChartConfig = {
		desktop: {
			label: "desktop",
			color: "black",
		},
	}
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<LineChart
						accessibilityLayer
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<YAxis />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						{something}
						{/* <Line
							dataKey={dataKey}
							type="monotone"
							stroke={`var(--color-${dataKey})`}
							strokeWidth={2}
							dot={false}
						/> */}
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	)
}

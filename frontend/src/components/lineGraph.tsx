import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "./ui/chart"

export default function LineGraph({
	title,
	data,
	configs = {},
	dataKey = "",
}: {
	title: string
	data: Array<any>
	configs: ChartConfig
	dataKey: string
}) {
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={configs}>
					<LineChart
						accessibilityLayer
						data={data}
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
						<Line
							dataKey={dataKey}
							type="monotone"
							stroke={`var(--color-${dataKey})`}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	)
}

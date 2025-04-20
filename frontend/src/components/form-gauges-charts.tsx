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
import { useRefreshContext, useUserContext } from "@/store/generalContext"
import { FormCharts } from "./form-chart"
import { FormGauges } from "./form-gauges"
import { ChartFormProps, GaugeFormProps, SwitchButtonFormProps } from "@/types"
import { FormSwitch } from "./form-switch"
import { getAllFields } from "@/api/fields"

export function FormGaugesCharts({ deviceId }: { deviceId: string }) {
	const { refresh, setRefresh } = useRefreshContext()
	const [formGauges, setFormGauges] = useState<GaugeFormProps>({
		topic: "",
		title: "",
		max_value: 100.0,
		min_value: 0.0,
		m_type: "",
		unit: "",
	})

	const [formSwitch, setFormSwitch] = useState<SwitchButtonFormProps>({
		switch_name: "",
		topic: "",
	})

	const [formCharts, setFormCharts] = useState<ChartFormProps>({
		title: "",
		topic: "",
		name: "",
		color: "black",
	})
	const { user } = useUserContext()
	const [selection, setSelection] = useState<string>("gauge")
	const [open, setOpen] = useState<boolean>(false)
	const [fields, setFields] = useState<string[] | null>([])

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
			name: "",
			color: "black",
		})
		setFormSwitch({
			switch_name: "",
			topic: "",
		})
	}

	const handleSubmitGauge = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: `/api/gauges/create/${user.userId}`,
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
				device_id: deviceId,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log(e))
		setRefresh(!refresh)
		setOpen(false)
		handleReset()
	}

	const handleSubmitChart = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: `/api/charts/create/${user.userId}`,
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
		handleReset()
	}

	const handleSubmitSwitch = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: `/api/switches/create/${user.userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data: {
				switch_name: formSwitch.switch_name,
				topic: formSwitch.topic,
				device_id: deviceId,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log(e.message))
		setRefresh(!refresh)
		setOpen(false)
		handleReset()
	}

	const selectionForms = () => {
		if (selection === "gauge") {
			return (
				<FormGauges
					formGauges={formGauges}
					setFormGauges={setFormGauges}
					fields={fields}
				/>
			)
		} else if (selection === "chart") {
			return (
				<FormCharts
					setFormCharts={setFormCharts}
					formCharts={formCharts}
					fields={fields}
				/>
			)
		} else if (selection === "switch") {
			return (
				<FormSwitch
					setFormSwitch={setFormSwitch}
					formSwitch={formSwitch}
					fields={fields}
				/>
			)
		}
	}

	const selectionButtons = () => {
		if (selection === "gauge") {
			return (
				<Button
					type="submit"
					onClick={handleSubmitGauge}
					className="cursor-pointer"
				>
					Create new Gauge
				</Button>
			)
		} else if (selection === "chart") {
			return (
				<Button
					type="submit"
					onClick={handleSubmitChart}
					className="cursor-pointer"
				>
					Create new Chart
				</Button>
			)
		} else if (selection === "switch") {
			return (
				<Button
					type="submit"
					onClick={handleSubmitSwitch}
					className="cursor-pointer"
				>
					Create new Switch
				</Button>
			)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={async (value) => {
				setOpen(value)
				let data = await getAllFields(user.userId, deviceId)
				setFields(data)
			}}
		>
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
							<SelectItem value="switch">Switch</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{selectionForms()}
				<DialogFooter>{selectionButtons()}</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

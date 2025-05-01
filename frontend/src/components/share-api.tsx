import { Copy, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ShareAPI({
	userId,
	componentId,
	componentType,
	topic,
}: {
	userId: string
	componentId: string
	componentType: "gauge" | "chart" | "switch"
	topic: string
}) {
	const typeSelection = () => {
		if (componentType === "gauge") {
			return <Label>Gauge ID</Label>
		} else if (componentType === "chart") {
			return <Label>Chart ID</Label>
		} else if (componentType === "switch") {
			return <Label>Switch ID</Label>
		}
	}
	return (
		<Dialog>
			<DialogTrigger className="cursor-pointer">
				<Settings className="text-black" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Connect to API</DialogTitle>
					<DialogDescription>Connect your API</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label>UserId</Label>
						<Input defaultValue={userId} readOnly />
					</div>
					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							navigator.clipboard.writeText(`${userId}`)
						}}
						size="sm"
						className="px-3 cursor-pointer"
					>
						<span className="sr-only">Copy</span>
						<Copy />
					</Button>
				</div>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						{typeSelection()}
						<Input defaultValue={componentId} readOnly />
					</div>
					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							navigator.clipboard.writeText(`${componentId}`)
						}}
						size="sm"
						className="px-3 cursor-pointer"
					>
						<span className="sr-only">Copy</span>
						<Copy />
					</Button>
				</div>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label>User Token (20mins)</Label>
						<Input defaultValue={`${localStorage.getItem("token")}`} readOnly />
					</div>
					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							navigator.clipboard.writeText(`${localStorage.getItem("token")}`)
						}}
						size="sm"
						className="px-3 cursor-pointer"
					>
						<span className="sr-only">Copy</span>
						<Copy />
					</Button>
				</div>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label>Topic</Label>
						<Input defaultValue={topic} readOnly />
					</div>
					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							navigator.clipboard.writeText(`${topic}`)
						}}
						size="sm"
						className="px-3 cursor-pointer"
					>
						<span className="sr-only">Copy</span>
						<Copy />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

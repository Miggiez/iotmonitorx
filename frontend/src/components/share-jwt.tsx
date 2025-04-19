import { Copy } from "lucide-react"

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

export function ShareJWT({
	deviceId,
	userId,
}: {
	deviceId: string
	userId: string
}) {
	return (
		<Dialog>
			<DialogTrigger className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]">
				<Copy className="text-black" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Connect Devices</DialogTitle>
					<DialogDescription>
						Connect your devices with the IOT platform
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label>UserId and DeviceId</Label>
						<Input defaultValue={`/${userId}/${deviceId}`} readOnly />
					</div>
					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							navigator.clipboard.writeText(`/${userId}/${deviceId}`)
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

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ShareJWT() {
	return (
		<Dialog>
			<DialogTrigger className="cursor-pointer hover:shadow-2xl p-1 hover:border-2 hover:rounded-[5px]">
				<Copy className="text-black" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share JWT</DialogTitle>
					<DialogDescription>
						A device with this can publish through MQTT
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="link" className="sr-only">
							JWT Token
						</Label>
						<Input
							id="link"
							defaultValue="https://ui.shadcn.com/docs/installation"
							readOnly
						/>
					</div>
					<Button type="submit" size="sm" className="px-3">
						<span className="sr-only">Copy</span>
						<Copy />
					</Button>
				</div>
				<DialogFooter className="sm:justify-start">
					<DialogClose>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

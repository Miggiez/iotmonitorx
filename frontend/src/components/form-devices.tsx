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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRefreshContext } from "@/store/generalContext"
import axios from "axios"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

export function FormDevices({ projectId }: { projectId: string }) {
	const [deviceName, setDeviceName] = useState<string>("")
	const [open, setOpen] = useState<boolean>(false)
	const { refresh, setRefresh } = useRefreshContext()
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setDeviceName(e.target.value)
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: "http://localhost:8000/devices/create/device",
			data: {
				device_name: deviceName,
				project_id: projectId,
			},
		})
			.then((res) => console.log(res.data))
			.catch((e) => console.log(e.message))

		setDeviceName("")
		setRefresh(!refresh)
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 md:h-8 md:text-sm sm:h-7 sm:text-xs lg:h-12 lg:text-sm lg:group-data-[collapsible=icon]:p-0! cursor-pointer">
				<PlusCircle />
				<span>Add Device</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Device</DialogTitle>
					<DialogDescription>
						Add a new device to hold your gauges and charts
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="deviceName" className="text-right">
							Device Name
						</Label>
						<Input
							id="deviceName"
							value={deviceName}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="submit"
						onClick={handleSubmit}
						className="cursor-pointer"
					>
						Create Device
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

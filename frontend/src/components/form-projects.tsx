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
import { PlusCircle } from "lucide-react"
import { useState } from "react"

export function FormProject() {
	const [title, setTitle] = useState<string>("")
	const [open, setOpen] = useState<boolean>(false)
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setTitle(e.target.value)
	}
	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setTitle("")
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 md:h-8 md:text-sm sm:h-7 sm:text-xs lg:h-12 lg:text-sm lg:group-data-[collapsible=icon]:p-0! cursor-pointer">
				<PlusCircle className="w-8" />
				<span>Add Project</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Project</DialogTitle>
					<DialogDescription>
						Add a new project to hold all devices with charts and gauges.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Title
						</Label>
						<Input
							id="title"
							value={title}
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
						Create Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

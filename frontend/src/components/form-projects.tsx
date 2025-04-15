import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogDescription,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, PlusCircle } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { useRefreshContext, useUserContext } from "@/store/generalContext"

const Type_Form = {
	edit: "edit",
	create: "create",
} as const

type TypeForm = keyof typeof Type_Form

export function FormProject({
	formType,
	projectId,
}: {
	formType: TypeForm
	projectId?: string
}) {
	const { user } = useUserContext()
	const { refresh, setRefresh } = useRefreshContext()
	const userId = user.userId
	const [title, setTitle] = useState<string>("")
	const [open, setOpen] = useState<boolean>(false)
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setTitle(e.target.value)
	}

	const handleSubmitEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (title !== "") {
			await axios({
				method: "put",
				url: `http://localhost:8000/projects/edit/${projectId}`,
				data: {
					title: title,
					user_id: userId,
				},
			})
				.then((data) => {
					console.log(data.data)
					setTitle("")
					setRefresh(!refresh)
					setOpen(false)
				})
				.catch((e) => console.log(e))
		}
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (title !== "") {
			await axios({
				method: "post",
				url: "http://localhost:8000/projects/create/project",
				data: {
					title: title,
					user_id: userId,
				},
			})
				.then((data) => {
					console.log(data.data)
					setTitle("")
					setRefresh(!refresh)
					setOpen(false)
				})
				.catch((e) => console.log(e))
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 md:h-8 md:text-sm sm:h-7 sm:text-xs lg:h-12 lg:text-sm lg:group-data-[collapsible=icon]:p-0! cursor-pointer">
				{formType === "create" ? (
					<>
						<PlusCircle className="w-8" />
						<span>Add Project</span>
					</>
				) : (
					<>
						<Edit2 className="w-8" />
						<span>Edit Project</span>
					</>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					{formType === "create" ? (
						<>
							<DialogTitle>Add New Project</DialogTitle>
							<DialogDescription>
								Add a new project to hold all devices with charts and gauges.
							</DialogDescription>
						</>
					) : (
						<>
							<DialogTitle>Edit Project</DialogTitle>
							<DialogDescription>
								Edit project to change title.
							</DialogDescription>
						</>
					)}
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
					{formType === "create" ? (
						<Button
							type="submit"
							onClick={handleSubmit}
							className="cursor-pointer"
						>
							Create Project
						</Button>
					) : (
						<Button
							type="submit"
							onClick={handleSubmitEdit}
							className="cursor-pointer"
						>
							Edit Project
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

"use client"

import { Bot, ChevronRight, Settings2, Terminal, Trash2 } from "lucide-react"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { FormProject } from "./form-projects"
import { FormDevices } from "./form-devices"
import { ProjectProps } from "@/types"
import { useEffect, useState } from "react"
import axios from "axios"
import { ScrollArea } from "./ui/scroll-area"
import { useRefreshContext } from "@/store/generalContext"

export function NavMain({ userId }: { userId: string }) {
	const [projects, setProjects] = useState<Array<ProjectProps>>([])
	const { refresh, setRefresh } = useRefreshContext()
	// const [refBut, setRefBut] = useState<boolean>(false)
	const getProjects = async (user_id: string) => {
		await axios({
			method: "get",
			url: `http://localhost:8000/user/${user_id}/getall/projects`,
		})
			.then((data) => {
				setProjects(data.data)
			})
			.catch((e) => console.log(e.message))
	}

	const deleteProject = async (projectId: string) => {
		await axios({
			method: "delete",
			url: `http://localhost:8000/projects/delete/${projectId}`,
		})
			.then((res) => {
				console.log(res.data)
				setRefresh(!refresh)
			})
			.catch((e) => console.log(e))
	}

	useEffect(() => {
		getProjects(userId)
	}, [refresh])
	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>
					<div className="flex items-center w-[100%]">
						Projects
						{/* <div
							onClick={() => setRefBut(!refBut)}
							className="ml-auto inline-block cursor-pointer"
						>
							<RefreshCw className="w-4" />
						</div> */}
					</div>
				</SidebarGroupLabel>
				<SidebarMenu>
					<SidebarMenuItem>
						<FormProject formType={"create"} />
					</SidebarMenuItem>
					<ScrollArea className="h-80">
						{projects.map((project) => (
							<Collapsible
								key={project.id}
								asChild
								defaultOpen={false}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={project.title}>
											<span>{project.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{project.devices?.map((device) => (
												<SidebarMenuSubItem key={device.id}>
													<SidebarMenuSubButton asChild>
														<Link
															to="/dashboard/device/$deviceId"
															params={{ deviceId: device.id }}
														>
															{device.device_name}
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
											<SidebarMenuSubItem>
												<FormDevices projectId={project.id} />
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<FormProject formType={"edit"} projectId={project.id} />
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuButton
													onClick={() => deleteProject(project.id)}
												>
													<Trash2 />
													<span>Delete Project</span>
												</SidebarMenuButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</ScrollArea>
				</SidebarMenu>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarMenu>
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<Collapsible asChild className="group/collapsible">
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip="Settings">
									{<Settings2 />}
									<span>Settings</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton asChild>
											<Link to=".">
												<Terminal />
												<span>System Log</span>
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuSubButton asChild>
											<Link to=".">
												<Bot />
												<span>Control Log</span>
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>
			</SidebarGroup>
		</>
	)
}

"use client"

import {
	Bot,
	ChevronRight,
	PlusCircle,
	Settings2,
	Terminal,
	type LucideIcon,
} from "lucide-react"

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

export function NavMain({
	projects,
}: {
	projects: {
		title: string
		url: string
		icon?: LucideIcon
		isActive?: boolean
		devices?: {
			title: string
			url: string
		}[]
	}[]
}) {
	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>Projects</SidebarGroupLabel>
				<SidebarMenu>
					{projects.map((project) => (
						<Collapsible
							key={project.title}
							asChild
							defaultOpen={project.isActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={project.title}>
										{project.icon && <project.icon />}
										<span>{project.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{project.devices?.map((device) => (
											<SidebarMenuSubItem key={device.title}>
												<SidebarMenuSubButton asChild>
													<Link to={device.url}>
														<span>{device.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<div className="cursor-pointer" onClick={() => {}}>
													<PlusCircle />
													<span>Add Device</span>
												</div>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					))}
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<div className="cursor-pointer" onClick={() => {}}>
								<PlusCircle />
								<span>Add Project</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
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

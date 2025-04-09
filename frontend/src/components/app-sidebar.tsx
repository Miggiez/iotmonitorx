import React, { useEffect } from "react"
import { SquareTerminal } from "lucide-react"
import axios from "axios"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
	user: {
		name: "user1",
		email: "user1@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
}

const navMain = {
	projects: [
		{
			title: "Project1",
			url: ".",
			icon: SquareTerminal,
			isActive: true,
			devices: [
				{
					title: "ESP32-1",
					url: "/dashboard/device/1",
				},
				{
					title: "ESP32-2",
					url: "/dashboard/device/2",
				},
			],
		},
		{
			title: "Project2",
			url: ".",
			icon: SquareTerminal,
			isActive: false,
			devices: [
				{
					title: "ESP32-3",
					url: "/dashboard/device/3",
				},
				{
					title: "ESP32-4",
					url: "/dashboard/device/4",
				},
			],
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	useEffect(() => {})
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser user={data.user} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain projects={navMain.projects} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

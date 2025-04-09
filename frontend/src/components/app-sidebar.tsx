import * as React from "react"
import { SquareTerminal } from "lucide-react"

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
	navMain: [
		{
			title: "Project1",
			url: ".",
			icon: SquareTerminal,
			isActive: true,
			devices: [
				{
					title: "ESP32-1",
					url: "/device/1",
				},
				{
					title: "ESP32-2",
					url: "/device/2",
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
					url: "/device/3",
				},
				{
					title: "ESP32-4",
					url: "/device/4",
				},
			],
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser user={data.user} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain projects={data.navMain} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

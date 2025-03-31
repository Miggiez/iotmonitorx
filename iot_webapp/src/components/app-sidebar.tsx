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
			title: "Devices",
			url: ".",
			icon: SquareTerminal,
			isActive: true,
			items: [
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
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser user={data.user} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

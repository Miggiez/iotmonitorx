import React, { useEffect, useState } from "react"
import { LucideProps, SquareTerminal } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { getProjects } from "@/api/userDashboard"

interface DeviceProps {
	title: string
	url: string
}

interface ProjectProps {
	title: string
	url: string
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>
	isActive: false
	devices: DeviceProps
}

// This is sample data.
const dataUser = {
	user: {
		name: "67fb6dc64f25c8ff5feed76a",
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
	const [data, setData] = useState<Array<ProjectProps>>([])
	useEffect(() => {
		getProjects(dataUser.user.name)
	})
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser user={dataUser.user} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain projects={navMain.projects} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

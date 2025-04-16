import React, { useState } from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { RefreshContext, useUserContext } from "@/store/generalContext"

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useUserContext()
	const userId = user.userId
	const userName = user.username
	const email = user.email

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser user={{ name: userName, email: email, avatar: "" }} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain userId={userId} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

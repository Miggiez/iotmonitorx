import { createFileRoute, Outlet } from "@tanstack/react-router"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { authenticate } from "@/api/auth"
import { RefreshContext, useRefreshContext } from "@/store/generalContext"
import { useState } from "react"

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async ({ context }) => {
		await authenticate({ context })
	},
	component: AppLayoutComponent,
})

function AppLayoutComponent() {
	const [refBut, setRefBut] = useState<boolean>(false)
	return (
		<RefreshContext.Provider value={{ refresh: refBut, setRefresh: setRefBut }}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Breadcrumb>
								{/* <BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink>
										<Link className="black" to=".">
											Something
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList> */}
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-col w-[100%] h-[100%] p-4">
						<Outlet />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</RefreshContext.Provider>
	)
}

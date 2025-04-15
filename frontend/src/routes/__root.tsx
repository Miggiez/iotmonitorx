import { UserContext } from "@/store/generalContext"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

type RouterContext = {
	authen: UserContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Outlet />
		</>
	)
}

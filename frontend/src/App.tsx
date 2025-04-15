import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import "./index.css"
import { UserContext } from "./store/generalContext"
import { useState } from "react"
import { User } from "./types"

const router = createRouter({
	routeTree,
	context: { authen: undefined! },
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

function App() {
	const [user, setUser] = useState<User>({
		userId: "",
		username: "",
		email: "",
		role: "",
	})
	return (
		<UserContext.Provider value={{ user, setUser }}>
			<RouterProvider router={router} context={{ authen: { user, setUser } }} />
		</UserContext.Provider>
	)
}

export default App

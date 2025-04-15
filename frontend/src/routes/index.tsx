import { LoginForm } from "@/components/login-form"
import { createFileRoute, redirect } from "@tanstack/react-router"
import axios from "axios"

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		let token = localStorage.getItem("token")
		if (token) {
			await axios({
				method: "get",
				url: `http://localhost:8000/auth/verif`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then()
				.catch(() => redirect({ to: "/" }))
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex h-full w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	)
}

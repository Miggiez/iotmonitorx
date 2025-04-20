import { UserContext } from "@/store/generalContext"
import { redirect } from "@tanstack/react-router"
import axios from "axios"

export const authenticate = async ({
	context,
}: {
	context: { authen: UserContext }
}) => {
	let token = localStorage.getItem("token")
	try {
		let res = await axios({
			method: "get",
			url: `/api/auth/verif`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		context.authen.setUser({
			userId: res.data.id,
			username: res.data.username,
			email: res.data.email,
			role: res.data.role,
		})
		return res.data.id
	} catch {
		throw redirect({ to: "/" })
	}
}

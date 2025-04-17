import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeClosed } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { LoginProps } from "@/types"
import axios from "axios"
import { redirect, useNavigate } from "@tanstack/react-router"

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate({ from: "/" })
	const [hidePass, setHidePass] = useState<boolean>(true)
	const [login, setLogin] = useState<LoginProps>({
		email: "",
		password: "",
	})
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLogin({ ...login, [e.target.name]: e.target.value })
	}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await axios({
			method: "post",
			url: "http://localhost:8000/auth/auth/login",
			data: {
				email: login.email,
				password: login.password,
			},
		})
			.then((data) => {
				let res = data.data
				let access_token = res.access_token
				localStorage.setItem("token", access_token)
				navigate({ to: "/dashboard" })
			})
			.catch((e) => console.log(e.message))
	}

	// const verifyUser = async () => {
	// 	let token = localStorage.getItem("token")
	// 	await axios({
	// 		method: "get",
	// 		url: `http://localhost:8000/auth/verif`,
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	})
	// 		.then(() => {
	// 			navigate({ to: "/dashboard" })
	// 		})
	// 		.catch((e) => {
	// 			console.log(e.message)
	// 			throw redirect({ to: "/" })
	// 		})
	// }

	// useEffect(() => {
	// 	verifyUser()
	// }, [])

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Suspense>
				<Card>
					<CardHeader>
						<CardTitle>Login to your IOT Dashboard</CardTitle>
						<CardDescription>
							Enter your email and password below
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit}>
							<div className="flex flex-col gap-6">
								<div className="grid gap-3">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										name="email"
										value={login.email}
										onChange={handleChange}
										placeholder="m@example.com"
										required
									/>
								</div>
								<div className="grid gap-3">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
										<div
											className="ml-auto inline-block cursor-pointer"
											onClick={() => setHidePass(!hidePass)}
										>
											{hidePass ? <EyeClosed /> : <Eye />}
										</div>
									</div>
									<Input
										id="password"
										type={hidePass ? "password" : "text"}
										name="password"
										value={login.password}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="flex flex-col gap-3">
									<Button type="submit" className="w-full">
										Login
									</Button>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</Suspense>
		</div>
	)
}

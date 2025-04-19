import { authenticate } from "@/api/auth"
import { LogDataTable } from "@/components/log-table"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/logs")({
	beforeLoad: async ({ context }) => ({
		getUserId: async () => await authenticate({ context }),
	}),
	component: RouteComponent,
	loader: async ({ context: { getUserId } }) => {
		return await getUserId()
	},
})

function RouteComponent() {
	const userId = Route.useLoaderData()
	return <LogDataTable userId={userId} />
}

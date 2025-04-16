import { User } from "@/types"
import { createContext, useContext } from "react"

export const UserContext = createContext<
	{ user: User; setUser: (newVal: User) => void } | undefined
>(undefined)
export const RefreshContext = createContext<
	{ refresh: boolean; setRefresh: (newVal: boolean) => void } | undefined
>(undefined)
export const RefreshContext2 = createContext<
	{ refresh: boolean; setRefresh: (newVal: boolean) => void } | undefined
>(undefined)

export function useUserContext() {
	const user = useContext(UserContext)
	if (user === undefined) {
		throw new Error("useUserContxt must be used with UserContext")
	}
	return user
}

export type UserContext = ReturnType<typeof useUserContext>

export function useRefreshContext() {
	const refresh = useContext(RefreshContext)
	if (refresh === undefined) {
		throw new Error("useRefreshContext must be used with RefreshContext")
	}
	return refresh
}

export function useRefreshContext2() {
	const refresh = useContext(RefreshContext2)
	if (refresh === undefined) {
		throw new Error("useRefreshContext2 must be used with RefreshContext2")
	}
	return refresh
}

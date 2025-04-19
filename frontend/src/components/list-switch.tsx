import { SwitchButtonProps } from "@/types"
import { useEffect, useState } from "react"
import axios from "axios"
import { SwitchButton } from "./switch-button"

export const ListSwitch = ({
	deviceId,
	refresh,
	userId,
	fields,
}: {
	deviceId: string
	refresh: boolean
	userId: string
	fields: string[] | null
}) => {
	const [switches, setSwitches] = useState<SwitchButtonProps[]>([])
	const getSwitches = async () => {
		await axios({
			method: "get",
			url: `http://localhost:8000/devices/${deviceId}/getall/switches/${userId}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				setSwitches(res.data)
			})
			.catch((e) => console.log(e.message))
	}
	useEffect(() => {
		getSwitches()
	}, [refresh, deviceId])

	return (
		<div className="flex flex-wrap justify-center space-x-10 space-y-4">
			{switches.map((sw) => (
				<SwitchButton
					id={sw.id}
					switchName={sw.switch_name}
					topic={sw.topic}
					deviceId={deviceId}
					fields={fields}
					userId={userId}
				/>
			))}
		</div>
	)
}

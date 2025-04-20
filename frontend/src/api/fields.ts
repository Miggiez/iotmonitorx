import axios from "axios"

export const getAllFields = async (userId: string, deviceId: string) => {
	try {
		let res = await axios({
			method: "get",
			url: `http://localhost:8000/devices/${userId}/${deviceId}/getall/fields`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})

		return res.data
	} catch (e: any) {
		console.log(e.response.data.detail)
	}
}

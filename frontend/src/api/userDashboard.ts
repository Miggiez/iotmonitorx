import axios from "axios"

export const getProjects = async (user_id: string) => {
	axios({
		method: "get",
		url: `http://localhost:8000/user/${user_id}/getall/projects`,
	})
		.then((data) => console.log(data))
		.catch((e) => console.log(e.message))
}

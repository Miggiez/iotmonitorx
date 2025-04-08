def user_individual_serial(users):
    return {
        "id": str(users["_id"]),
        "username": users["username"],
        "email": users["email"],
        "password": users["password"],
        "project": users["project"],
        "logs": users["logs"],
        "role": users["role"],
    }


def user_list_serial(users) -> list:
    return [user_individual_serial(user) for user in users]

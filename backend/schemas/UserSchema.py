def individual_serial(users):
    return {
        "id": str(users["_id"]),
        "username": users["username"],
        "password": users["password"],
    }


def list_serial(users) -> list:
    return [individual_serial(user) for user in users]

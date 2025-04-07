def individual_serial(projects):
    return {
        "id": str(projects["_id"]),
        "title": projects["title"],
        "devices": projects["devices"],
        "user_id": projects["user_id"],
    }


def project_list_serial(projects) -> list:
    return [individual_serial(project) for project in projects]

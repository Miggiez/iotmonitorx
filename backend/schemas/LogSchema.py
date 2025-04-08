def log_individual_serial(logs):
    return {
        "id": str(logs["_id"]),
        "title": logs["title"],
        "l_type": logs["l_type"],
        "description": logs["description"],
        "level": logs["level"],
        "user_id": logs["user_id"],
    }


def log_list_serial(logs) -> list:
    return [log_individual_serial(log) for log in logs]

def log_individual_serial(logs):
    return {
        "id": str(logs["_id"]),
        "title": logs["title"],
        "l_type": logs["l_type"],
        "description": logs["description"],
        "level": logs["level"],
        "created_at": logs["created_at"],
        "updated_at": logs["updated_at"],
    }


def log_list_serial(logs) -> list:
    return [log_individual_serial(log) for log in logs]

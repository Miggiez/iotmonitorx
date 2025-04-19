def switch_individual_serial(switches):
    return {
        "id": str(switches["_id"]),
        "switch_name": switches["switch_name"],
        "topic": switches["topic"],
        "created_at": switches["created_at"],
        "updated_at": switches["updated_at"],
    }


def switch_list_serial(switches) -> list:
    return [switch_individual_serial(switch) for switch in switches]

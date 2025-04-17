def switch_individual_serial(charts):
    return {
        "id": str(charts["_id"]),
        "title": charts["title"],
        "topic": charts["topic"],
        "name": charts["name"],
        "color": charts["color"],
        "created_at": charts["created_at"],
        "updated_at": charts["updated_at"],
    }


def switch_list_serial(charts) -> list:
    return [switch_individual_serial(chart) for chart in charts]

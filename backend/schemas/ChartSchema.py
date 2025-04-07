def chart_individual_serial(charts):
    return {
        "id": str(charts["_id"]),
        "title": charts["title"],
        "topic": charts["topic"],
        "configs": charts["configs"],
        "device_id": charts["device_id"],
    }


def chart_list_serial(charts) -> list:
    return [chart_individual_serial(chart) for chart in charts]

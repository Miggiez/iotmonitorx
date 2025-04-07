def individual_serial(gauges):
    return {
        "id": str(gauges["_id"]),
        "topic": gauges["topic"],
        "title": gauges["title"],
        "max_value": gauges["max_value"],
        "min_value": gauges["min_value"],
        "m_type": gauges["m_type"],
        "unit": gauges["unit"],
        "device_id": gauges["device_id"],
    }


def gauge_list_serial(gauges) -> list:
    return [individual_serial(gauge) for gauge in gauges]

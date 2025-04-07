def device_individual_serial(devices):
    return {
        "id": str(devices["_id"]),
        "device_name": devices["device_name"],
        "charts": devices["charts"],
        "gauges": devices["gauges"],
        "project_id": devices["project_id"],
    }


def device_list_serial(devices) -> list:
    return [device_individual_serial(device) for device in devices]

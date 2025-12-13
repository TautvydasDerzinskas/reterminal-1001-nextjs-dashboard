export interface DeviceData {
    battery: number;
    temperature: number;
    humidity: number;
    firmware_version: string;
    device_name: string;
    isOutdated?: boolean;
}

export interface LoginResponse {
    code: number;
    msg: string;
    data: {
        account: string;
        orgId: number;
        org_id: string;
        token: string;
        user_id: number;
        child_id: number;
        refresh_token: string;
        nickname: string;
        temperature_unit: number;
    };
}

export interface DeviceSensorData {
    battery: {
        charging: boolean;
        level: number;
    };
    buttons: {
        left: number;
        right: number;
    };
    dataaccess: {
        interval: number;
    };
    devicestatus: {
        status: number;
    };
    power: {
        deep_sleep_disabled: number;
    };
    sd: {
        is_inserted: boolean;
    };
    sensor: {
        humidity: number;
        temp: number;
    };
}

export interface DeviceBoard {
    type: string;
    screen_type: string;
    ssid: string;
    rssi: number;
    channel: number;
    ip: string;
    mac: string;
    img_format: string;
}

export interface Device {
    id: number;
    sn: string;
    device_name: string;
    mac_address: string;
    chip_model_name: string;
    version: string;
    board: DeviceBoard;
    device_image: string;
    online_status: number;
    last_seen: number;
    target_interval: number;
    sensor_data: DeviceSensorData;
}

export interface DeviceListResponse {
    code: number;
    result: Device[];
    message: string;
}

export interface TokenCache {
    token: string;
    timestamp: number;
}

export interface DeviceCache {
    data: DeviceData;
    timestamp: number;
}
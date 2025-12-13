export interface DeviceData {
    battery: number;
    temperature: number;
    humidity: number;
    firmware_version: string;
    device_name: string;
    isOutdated?: boolean;
}
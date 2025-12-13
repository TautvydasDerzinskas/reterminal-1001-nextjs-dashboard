import { DeviceData, LoginResponse, DeviceListResponse, TokenCache, DeviceCache } from './types';

// In-memory cache
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache: Record<string, any> = {};

async function readCache(key: string): Promise<unknown | null> {
    return memoryCache[key] || null;
}

async function writeCache(key: string, data: unknown): Promise<void> {
    memoryCache[key] = data;
}

export async function fetchDeviceData(): Promise<DeviceData> {
    const username = process.env.SENSECRAFT_LOGIN_USERNAME;
    const passwordEncoded = process.env.SENSECRAFT_LOGIN_PASSWORD_ENCODED;

    if (!username || !passwordEncoded) {
        throw new Error('SenseCAP login credentials not configured');
    }

    const LOGIN_URL = `https://sensecap.seeed.cc/portalapi/user/login?account=${username}&password=${passwordEncoded}&origin=1`;

    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000;

    let token: string;
    const tokenCache = await readCache('token_cache') as TokenCache | null;
    if (tokenCache && (now - tokenCache.timestamp) < threeHours) {
        token = tokenCache.token;
    } else {
        // First, authenticate and get token
        const loginRes = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!loginRes.ok) {
            throw new Error('Failed to authenticate');
        }

        const loginResponse: LoginResponse = await loginRes.json();
        if (loginResponse.code !== 0) {
            throw new Error(loginResponse.msg || 'Login failed');
        }

        token = loginResponse.data.token;
        await writeCache('token_cache', { token, timestamp: now });
    }

    const DEVICE_LIST_URL = "https://sensecraft-hmi-api.seeed.cc/api/v2/user/device/list";
    try {
        const devicesRes = await fetch(DEVICE_LIST_URL, {
            headers: {
                'Authorization': token,
            },
            next: { revalidate: 60 }
        });

        if (!devicesRes.ok) {
            const responseText = await devicesRes.text();
            console.error('Device list fetch failed:', devicesRes.status, devicesRes.statusText, responseText);
            throw new Error(`Failed to fetch device list: ${devicesRes.status} ${devicesRes.statusText}`);
        }

        const devicesResponse: DeviceListResponse = await devicesRes.json();
        if (devicesResponse.code !== 200) {
            throw new Error(devicesResponse.message || 'API error');
        }

        const devices = devicesResponse.result;
        if (!devices || devices.length === 0) {
            throw new Error('No devices found');
        }

        // Use the first device
        const device = devices[0];
        const sensorData = device.sensor_data;

        const battery = sensorData.battery?.level || 0;
        const temperature = sensorData.sensor?.temp || 0;
        const humidity = sensorData.sensor?.humidity || 0;
        const firmware_version = device.version || 'Unknown';
        const device_name = device.device_name || 'Unknown';

        const deviceData = { battery, temperature, humidity, firmware_version, device_name, isOutdated: false };
        await writeCache('device_cache', { data: deviceData, timestamp: now });
        return deviceData;
    } catch (error) {
        const deviceCache = await readCache('device_cache') as DeviceCache | null;
        if (deviceCache) {
            return { ...deviceCache.data, isOutdated: true };
        } else {
            throw error;
        }
    }
}
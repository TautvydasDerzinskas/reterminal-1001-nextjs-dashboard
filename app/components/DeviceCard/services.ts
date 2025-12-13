// Fetch device data server-side
import fs from 'fs/promises';
import path from 'path';
import { DeviceData, LoginResponse, DeviceListResponse, TokenCache, DeviceCache } from './types';

const CACHE_DIR = path.join(process.cwd(), 'data');
const TOKEN_CACHE_PATH = path.join(CACHE_DIR, 'token_cache.json');
const DEVICE_CACHE_PATH = path.join(CACHE_DIR, 'device_cache.json');

async function readCache(filePath: string): Promise<unknown | null> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function writeCache(filePath: string, data: unknown): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
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
    const tokenCache = await readCache(TOKEN_CACHE_PATH) as TokenCache | null;
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
        console.log('Login Response:', loginResponse);
        if (loginResponse.code !== 0) {
            throw new Error(loginResponse.msg || 'Login failed');
        }

        token = loginResponse.data.token;
        try {
            await writeCache(TOKEN_CACHE_PATH, { token, timestamp: now });
        } catch {
            // Ignore cache write failures (e.g., on read-only file systems like Vercel)
        }
    }

    // Now, fetch device list
    const DEVICE_LIST_URL = "https://sensecraft-hmi-api.seeed.cc/api/v2/user/device/list";
    try {
        const devicesRes = await fetch(DEVICE_LIST_URL, {
            headers: {
                'Authorization': token,
            },
            next: { revalidate: 60 }
        });

        if (!devicesRes.ok) {
            throw new Error('Failed to fetch device list');
        }

        const devicesResponse: DeviceListResponse = await devicesRes.json();
        console.log('Devices Response:', devicesResponse);
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
        try {
            await writeCache(DEVICE_CACHE_PATH, { data: deviceData, timestamp: now });
        } catch {
            // Ignore cache write failures (e.g., on read-only file systems like Vercel)
        }
        return deviceData;
    } catch (error) {
        const deviceCache = await readCache(DEVICE_CACHE_PATH) as DeviceCache | null;
        if (deviceCache) {
            return { ...deviceCache.data, isOutdated: true };
        } else {
            throw error;
        }
    }
}
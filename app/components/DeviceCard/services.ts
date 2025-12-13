import { DeviceData, LoginResponse, Device } from './types';


async function getAuthToken(): Promise<string> {
    const username = process.env.SENSECRAFT_LOGIN_USERNAME;
    const passwordEncoded = process.env.SENSECRAFT_LOGIN_PASSWORD_ENCODED;

    if (!username || !passwordEncoded) {
        throw new Error('Error while authenticating to device api...');
    }

    const LOGIN_URL = `https://sensecap.seeed.cc/portalapi/user/login?account=${username}&password=${passwordEncoded}&origin=1`;

    // Authenticate and get token
    let loginRes: Response;
    try {
        loginRes = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
    } catch {
        throw new Error('Error while authenticating to device api...');
    }

    if (!loginRes.ok) {
        throw new Error('Error while authenticating to device api...');
    }

    const loginResponse: LoginResponse = await loginRes.json();
    if (loginResponse.code !== 0) {
        throw new Error('Error while authenticating to device api...');
    }

    const token = loginResponse.data.token;
    return token;
}

async function fetchDeviceDetail(token: string): Promise<Device> {
    const deviceId = process.env.SENSECRAFT_DEVICE_ID;
    const DEVICE_DETAIL_URL = `https://sensecraft-hmi-api.seeed.cc/api/v2/user/device/detail/${deviceId}`;

    let devicesRes: Response;
    let attempts = 0;
    const maxAttempts = 3; // Increased from 2 to 3

    while (attempts < maxAttempts) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            devicesRes = await fetch(DEVICE_DETAIL_URL, {
                headers: {
                    'Authorization': token,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Origin': 'https://sensecraft.seeed.cc',
                    'Referer': 'https://sensecraft.seeed.cc/',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site',
                    'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
                cache: 'no-store',
                next: { revalidate: 0 },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
        } catch (error) {
            console.error('Fetch attempt failed:', error);
            attempts++;
            if (attempts >= maxAttempts) {
                if (error instanceof Error && error.name === 'AbortError') {
                    throw new Error('0 Error loading device sensors data... Request timeout after retries');
                }
                throw new Error('0 Error loading device sensors data... Network error after retries');
            }
            // Add delay before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // 1s, 2s delay
            continue;
        }

        if (devicesRes.ok) {
            break;
        }

        attempts++;
        if (attempts >= maxAttempts) {
            let errorDetails = '';
            try {
                const respJson = await devicesRes.json();
                errorDetails = JSON.stringify(respJson);
            } catch {
                try {
                    const responseText = await devicesRes.text();
                    errorDetails = responseText;
                } catch {
                    errorDetails = 'Unable to read response';
                }
            }
            console.error(
                'Device detail fetch failed after retries:',
                devicesRes.status,
                devicesRes.statusText,
                errorDetails
            );
            throw new Error(`Error loading device sensors data... ${errorDetails} ${attempts}`);
        }
        // Add delay before retry on error status
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }

    const deviceResponse: { code: number; result: Device; message: string } = await devicesRes!.json();
    if (deviceResponse.code !== 200) {
        throw new Error('2 Error loading device sensors data...');
    }

    return deviceResponse.result;
}

export async function fetchDeviceData(): Promise<DeviceData> {
    try {
        const token = await getAuthToken();
        // Small delay after token fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        const device = await fetchDeviceDetail(token);
        const sensorData = device.sensor_data;

        const battery = sensorData.battery?.level || 0;
        const temperature = sensorData.sensor?.temp || 0;
        const humidity = sensorData.sensor?.humidity || 0;
        const firmware_version = device.version || 'Unknown';
        const device_name = device.device_name || 'Unknown';

        const deviceData = { battery, temperature, humidity, firmware_version, device_name, isOutdated: false };
        return deviceData;
    } catch (error) {
        throw error;
    }
}
import { DeviceData } from './types';
import { fetchDeviceData } from './services';
import { HiExclamationTriangle, HiBattery0, HiBattery50, HiBattery100, HiHomeModern, HiCloud, HiCog, HiClock } from 'react-icons/hi2';

export default async function DeviceCard() {
    let device: DeviceData | null = null;

    try {
        device = await fetchDeviceData();
    } catch (err) {
        console.error('Error fetching device data:', err);
        return (
            <>
            <div className="card !rounded-md">
                <p className="text-center">Error loading device data: {err instanceof Error ? err.message : String(err)}</p>
            </div>
            <div className="card !rounded-md">
                <p className="text-center">Error loading device sensors data</p>
            </div>
            </>
        );
    }

    return (
        <>
            <div className="card flex flex-wrap items-center justify-start gap-4 !rounded-md">
                <span className="weather-details">
                    {device.battery >= 80 ? <HiBattery100 className="inline mr-1" /> : device.battery >= 50 ? <HiBattery50 className="inline mr-1" /> : <HiBattery0 className="inline mr-1" />}
                    {device.battery}%
                </span>
                <span className="weather-details">
                    <HiClock className="inline mr-1" />
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Warsaw' })}
                </span>
                <span className="weather-details">
                    <HiCog className="inline mr-1" />
                    {device.firmware_version}
                </span>
            </div>
            <div className="card flex flex-wrap items-center justify-end gap-4 !rounded-md">
                {device.isOutdated && (
                    <span className="text-yellow-600 font-semibold">
                        <HiExclamationTriangle className="inline mr-1" /> Outdated data
                    </span>
                )}
                <span className="weather-details">
                    <HiHomeModern className="inline mr-1" />
                    {device.temperature}°C
                </span>
                <span className="weather-details">
                    <HiCloud className="inline mr-1" />
                    {device.humidity}%
                </span>
            </div>
        </>
    );
}
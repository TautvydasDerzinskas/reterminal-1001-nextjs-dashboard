import { DeviceData } from './types';
import { fetchDeviceData } from './services';
import { HiExclamationTriangle, HiBattery0, HiBattery50, HiBattery100 } from 'react-icons/hi2';
import { FaDroplet } from "react-icons/fa6";
import { FaTemperatureHigh, FaGitSquare } from "react-icons/fa";
import { DeviceTime } from './DeviceTime';

export default async function DeviceCard() {
    let device: DeviceData | null = null;

    try {
        device = await fetchDeviceData();
    } catch (error) {
        return (
            <div className="card !rounded-md !bg-black !text-white">
                <p className="text-center font-semibold">{error instanceof Error ? error.message : 'Error loading data...'}</p>
            </div>
        );
    }

    return (
            <div className="card !rounded-md !bg-black !text-white flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="card-cell font-semibold">
                        {device.battery >= 80 ? <HiBattery100 size={22} className="inline mr-1" /> : device.battery >= 50 ? <HiBattery50 size={22} className="inline mr-1" /> : <HiBattery0 size={22} className="inline mr-1" />}
                        {device.battery}%
                    </span>
                    <DeviceTime />
                    <span className="card-cell font-semibold">
                        <FaGitSquare size={22} className="inline mr-1" />
                        {device.firmware_version}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {device.isOutdated && (
                        <span className="card-cell font-semibold">
                            <HiExclamationTriangle size={22} className="inline mr-1" /> Outdated data
                        </span>
                    )}
                    <span className="card-cell font-semibold">
                        <FaTemperatureHigh size={22} className="inline mr-1" />
                        {device.temperature}°C
                    </span>
                    <span className="card-cell font-semibold">
                        <FaDroplet size={22} className="inline mr-1" />
                        {device.humidity}%
                    </span>
                </div>
            </div>
    );
}
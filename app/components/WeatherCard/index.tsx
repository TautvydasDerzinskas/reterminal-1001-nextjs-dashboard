import { WeatherCardProps, WeatherData } from './types';
import { fetchWeatherData } from './services';
import { getWeatherIcon } from './utils';

export default async function WeatherCard({ location }: WeatherCardProps) {
    let weather: WeatherData | null = null;

    try {
        weather = await fetchWeatherData(location);
    } catch {
        return (
            <div className="card">
                <p className="text-center">Error loading weather for {location}</p>
            </div>
        );
    }

    return (
        <div className="card !p-4 !rounded-md">
            <h2 className="text-center mb-4">
                <span className="bg-black text-white rounded-md px-10 py-2">{location}</span>
            </h2>
            <div className="flex justify-center items-center text-black !mb-0">
                {getWeatherIcon(weather.description)}
            </div>
            <p className="card-cell text-center !text-xl !mb-4 !mt-0">
                {weather.description} <span className="font-bold ml-2">{weather.currentTemp}°C / {weather.humidity}%</span>
            </p>
            <p className="card-cell text-center">
                <span>Today: </span>
                <span className="font-bold ml-2">{weather.highTemp}°C / {weather.lowTemp}°C</span>
            </p>
            <p className="card-cell text-center">
                <span>Tomorrow: </span>
                <span className="font-bold ml-2">{weather.tomorrowTempHigh}°C / {weather.tomorrowTempLow}°C</span>
            </p>
        </div>
    );
}
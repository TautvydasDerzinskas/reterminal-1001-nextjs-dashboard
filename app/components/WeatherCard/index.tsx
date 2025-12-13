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
            <p className="weather-details text-center !text-xl !mb-4 !mt-0">
                {weather.description} <span className="font-bold">{weather.currentTemp}°C / {weather.humidity}%</span>
            </p>
            <p className="weather-details text-center">
                <strong>Today: </strong>
                {weather.highTemp}°C / {weather.lowTemp}°C
            </p>
            <p className="weather-details text-center">
                <strong>Tomorrow: </strong>
                {weather.tomorrowTempHigh}°C / {weather.tomorrowTempLow}°C
            </p>
        </div>
    );
}
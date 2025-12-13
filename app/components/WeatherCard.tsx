import locations from '@/data/locations.json';
import { WiDaySunny, WiCloudy, WiDayCloudyHigh, WiFog, WiRain, WiSnow, WiThunderstorm, WiCloud } from 'react-icons/wi';

interface LocationData {
    latitude: number;
    longitude: number;
    [key: string]: unknown;
}

interface WeatherCardProps {
    location: string; // City name
}

interface WeatherData {
    currentTemp: number;
    highTemp: number;
    lowTemp: number;
    humidity: number;
    description: string;
    tomorrowTempHigh: number;
    tomorrowTempLow: number;
}

// Get weather description from WMO weather code
function getWeatherDescription(code: number): string {
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2) return 'Cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 85) return 'Snowy';
    if (code === 95 || code === 96 || code === 99) return 'Stormy';
    return 'Unknown';
}

// Fetch weather data server-side
async function fetchWeatherData(location: string): Promise<WeatherData> {
    const locationData = (locations as Record<string, LocationData>)[location];

    if (!locationData) {
        throw new Error('Location not found');
    }

    const { latitude, longitude } = locationData;

    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`,
        { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!weatherRes.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current;
    const daily = weatherData.daily;

    return {
        currentTemp: Math.round(current.temperature_2m),
        highTemp: Math.round(daily.temperature_2m_max[0]),
        lowTemp: Math.round(daily.temperature_2m_min[0]),
        humidity: current.relative_humidity_2m,
        description: getWeatherDescription(current.weather_code),
        tomorrowTempHigh: Math.round(daily.temperature_2m_max[1]),
        tomorrowTempLow: Math.round(daily.temperature_2m_min[1]),
    };
}

// Weather icon based on description
function getWeatherIcon(description: string) {
    const iconSize = 80;
    const iconProps = { size: iconSize };

    switch (description) {
        case 'Clear':
            return <WiDaySunny {...iconProps} />;
        case 'Cloudy':
            return <WiCloudy {...iconProps} />;
        case 'Overcast':
            return <WiDayCloudyHigh {...iconProps} />;
        case 'Foggy':
            return <WiFog {...iconProps} />;
        case 'Rainy':
            return <WiRain {...iconProps} />;
        case 'Snowy':
            return <WiSnow {...iconProps} />;
        case 'Stormy':
            return <WiThunderstorm {...iconProps} />;
        default:
            return <WiCloud {...iconProps} />;
    }
}

export default async function WeatherCard({ location }: WeatherCardProps) {
    let weather: WeatherData | null = null;

    try {
        weather = await fetchWeatherData(location);
    } catch (error) {
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

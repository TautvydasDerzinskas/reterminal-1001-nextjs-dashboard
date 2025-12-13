import locations from '@/data/locations.json';
import { LocationData, WeatherData } from './types';
import { getWeatherDescription } from './utils';

// Fetch weather data server-side
export async function fetchWeatherData(location: string): Promise<WeatherData> {
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
export interface LocationData {
    latitude: number;
    longitude: number;
    [key: string]: unknown;
}

export interface WeatherCardProps {
    location: string; // City name
}

export interface WeatherData {
    currentTemp: number;
    highTemp: number;
    lowTemp: number;
    humidity: number;
    description: string;
    tomorrowTempHigh: number;
    tomorrowTempLow: number;
}
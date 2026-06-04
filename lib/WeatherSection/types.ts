export interface LocationData {
    latitude: number;
    longitude: number;
    [key: string]: unknown;
}

export interface WeatherCardProps {
    location: string;
}

export interface DayForecast {
    dayLabel: string;
    highTemp: number;
    lowTemp: number;
    description: string;
}

export interface WeatherData {
    currentTemp: number;
    highTemp: number;
    lowTemp: number;
    humidity: number;
    description: string;
    tomorrowTempHigh: number;
    tomorrowTempLow: number;
    forecast: DayForecast[];
}

export interface OpenMeteoCurrentUnits {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    weather_code: string;
}

export interface OpenMeteoCurrent {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
}

export interface OpenMeteoDailyUnits {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    weather_code: string;
}

export interface OpenMeteoDaily {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
}

export interface OpenMeteoResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: OpenMeteoCurrentUnits;
    current: OpenMeteoCurrent;
    daily_units: OpenMeteoDailyUnits;
    daily: OpenMeteoDaily;
}

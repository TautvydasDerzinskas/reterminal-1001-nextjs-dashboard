import { WiDaySunny, WiCloudy, WiDayCloudyHigh, WiFog, WiRain, WiSnow, WiThunderstorm, WiCloud } from 'react-icons/wi';

export function getWeatherDescription(code: number): string {
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2) return 'Cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 85) return 'Snowy';
    if (code === 95 || code === 96 || code === 99) return 'Stormy';
    return 'Unknown';
}

export function getWeatherIcon(description: string, size = 80) {
    const iconProps = { size };

    switch (description) {
        case 'Clear':    return <WiDaySunny {...iconProps} />;
        case 'Cloudy':   return <WiCloudy {...iconProps} />;
        case 'Overcast': return <WiDayCloudyHigh {...iconProps} />;
        case 'Foggy':    return <WiFog {...iconProps} />;
        case 'Rainy':    return <WiRain {...iconProps} />;
        case 'Snowy':    return <WiSnow {...iconProps} />;
        case 'Stormy':   return <WiThunderstorm {...iconProps} />;
        default:         return <WiCloud {...iconProps} />;
    }
}

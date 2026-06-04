import { WeatherData } from './types';
import { getWeatherIcon } from './utils';
import { theme } from '../shared/theme';
import { labels } from '../shared/labels';
import { CityBadge } from './WeatherSectionCityBadge';

interface Props {
  weather: WeatherData | null;
  location: string;
}

export const WeatherSectionWeatherCard = ({ weather, location }: Props) => (
  <div
    style={{
      flex: 1,
      border: theme.border.card,
      borderRadius: theme.radius.card,
      padding: theme.padding.card,
      backgroundColor: theme.colors.cardBackground,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.colors.text,
    }}
  >
    <h4 style={{ margin: '0 0 8px 0', fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
      <CityBadge>{location}</CityBadge>
    </h4>

    {weather ? (
      <div style={{ fontSize: theme.fontSizes.sm, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {getWeatherIcon(weather.description)}
        </div>
        <div style={{ display: 'flex', fontSize: theme.fontSizes.lg, marginBottom: '10px' }}>
          {weather.description}: {weather.currentTemp}°C / {weather.humidity}%
        </div>
        <div style={{ display: 'flex' }}>
          <strong>{labels.today}</strong>: {weather.highTemp}°C / {weather.lowTemp}°C
        </div>
        <div style={{ display: 'flex' }}>
          <strong>{labels.tomorrow}</strong>: {weather.tomorrowTempHigh}°C / {weather.tomorrowTempLow}°C
        </div>
      </div>
    ) : (
      <div style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text, display: 'flex' }}>
        {labels.weatherLoadFailed}
      </div>
    )}
  </div>
);

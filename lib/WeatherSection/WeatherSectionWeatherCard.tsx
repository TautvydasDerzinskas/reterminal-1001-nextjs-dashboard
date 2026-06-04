import { WeatherData } from './types';
import { getWeatherIcon } from './utils';
import { theme } from '../shared/theme';
import { labels } from '../shared/labels';
import { styles } from '../shared/styles';
import { ThermometerIcon, HumidityIcon } from '../icons';

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
      overflow: 'hidden',
      backgroundColor: theme.colors.cardBackground,
      ...styles.flexCol,
      color: theme.colors.text,
    }}
  >
    <div
      style={{
        backgroundColor: theme.colors.cardBackgroundDark,
        color: theme.colors.textInverted,
        ...styles.flexCenter,
        padding: `6px 0`,
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
      }}
    >
      {location}
    </div>

    <div style={{ ...styles.flexColCenter }}>
      {weather ? (
        <div style={{ fontSize: theme.fontSizes.sm, ...styles.flexCol, width: '100%' }}>
          <div style={{ ...styles.flexCenter, paddingLeft: theme.padding.card, paddingRight: theme.padding.card }}>
            {getWeatherIcon(weather.description)}
          </div>
          <div style={{ ...styles.flexCenter, fontSize: theme.fontSizes.lg, gap: '4px', paddingLeft: theme.padding.card, paddingRight: theme.padding.card, paddingBottom: theme.padding.card }}>
            <span>{labels.now}</span> <ThermometerIcon size={20} /><span>{`${weather.currentTemp}°C`}</span> /
            <HumidityIcon size={20} /><span>{`${weather.humidity}%`}</span>
          </div>
          <div style={{ ...styles.flexRow, width: '100%' }}>
            {weather.forecast.slice(0, 3).map((day, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  ...styles.flexColCenter,
                  padding: '4px 2px',
                  backgroundColor: i === 0 ? theme.colors.cardBackgroundDark : theme.colors.cardBackground,
                  color: i === 0 ? theme.colors.textInverted : theme.colors.text,
                }}
              >
                <div style={{ ...styles.flexCenter }}>
                  {getWeatherIcon(day.description, 28)}
                </div>
                <div style={{ display: 'flex', fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.bold }}>
                  {day.dayLabel}
                </div>
                <div style={{ ...styles.flexAlignCenter, gap: '2px', fontSize: theme.fontSizes.sm }}>
                  <ThermometerIcon size={14} /><span>{`${day.highTemp}°C`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text, display: 'flex', padding: theme.padding.card }}>
          {labels.weatherLoadFailed}
        </div>
      )}
    </div>
  </div>
);

import { WeatherData } from '../../weather/types';
import { theme } from '../../theme';
import { WeatherCard } from './WeatherCard';

interface Props {
  weatherData: (WeatherData | null)[];
  cities: string[];
}

export const WeatherSection = ({ weatherData, cities }: Props) => (
  <div style={{ display: 'flex', gap: theme.gap.cards, marginBottom: theme.gap.cardBottom }}>
    {weatherData.map((weather, index) => (
      <WeatherCard key={index} weather={weather} location={cities[index]} />
    ))}
  </div>
);

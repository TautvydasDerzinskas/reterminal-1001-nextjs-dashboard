import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../../../lib/components/WeatherSection/WeatherCard';
import { WeatherData } from '../../../lib/weather/types';

const mockWeather: WeatherData = {
  currentTemp: 22,
  highTemp: 25,
  lowTemp: 14,
  humidity: 60,
  description: 'Clear',
  tomorrowTempHigh: 23,
  tomorrowTempLow: 13,
};

describe('WeatherCard', () => {
  it('renders the location name', () => {
    render(<WeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText('Vilnius')).toBeInTheDocument();
  });

  it('renders the weather description and temperature', () => {
    render(<WeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/Clear/)).toBeInTheDocument();
    expect(screen.getByText(/22°C/)).toBeInTheDocument();
  });

  it('renders today high/low temperatures', () => {
    render(<WeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByText(/14°C/)).toBeInTheDocument();
  });

  it('renders tomorrow high/low temperatures', () => {
    render(<WeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/23°C/)).toBeInTheDocument();
    expect(screen.getByText(/13°C/)).toBeInTheDocument();
  });

  it('renders the humidity value', () => {
    render(<WeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });

  it('renders the fallback message when weather is null', () => {
    render(<WeatherCard weather={null} location="Vilnius" />);
    expect(screen.getByText('Failed to load weather')).toBeInTheDocument();
  });

  it('still renders the location when weather is null', () => {
    render(<WeatherCard weather={null} location="Kaunas" />);
    expect(screen.getByText('Kaunas')).toBeInTheDocument();
  });
});

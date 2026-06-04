import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherSectionWeatherCard } from './WeatherSectionWeatherCard';
import { WeatherData } from './types';

const mockWeather: WeatherData = {
  currentTemp: 22,
  highTemp: 25,
  lowTemp: 14,
  humidity: 60,
  description: 'Clear',
  tomorrowTempHigh: 23,
  tomorrowTempLow: 13,
  forecast: [
    { dayLabel: 'Today', highTemp: 25, lowTemp: 14, description: 'Clear' },
    { dayLabel: 'Fri', highTemp: 23, lowTemp: 13, description: 'Cloudy' },
    { dayLabel: 'Sat', highTemp: 20, lowTemp: 11, description: 'Rainy' },
  ],
};

describe('WeatherCard', () => {
  it('renders the location name', () => {
    render(<WeatherSectionWeatherCard weather={mockWeather} location="Vilnius" />);
  });

  it('renders the weather description and temperature', () => {
    render(<WeatherSectionWeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/22°C/)).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });

  it('renders today high/low temperatures', () => {
    render(<WeatherSectionWeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
  });

  it('renders tomorrow high/low temperatures', () => {
    render(<WeatherSectionWeatherCard weather={mockWeather} location="Vilnius" />);
    expect(screen.getByText(/23°C/)).toBeInTheDocument();
    expect(screen.getByText(/Fri/)).toBeInTheDocument();
  });

  it('renders the fallback message when weather is null', () => {
    render(<WeatherSectionWeatherCard weather={null} location="Vilnius" />);
    expect(screen.getByText('Failed to load weather')).toBeInTheDocument();
  });

  it('still renders the location when weather is null', () => {
    render(<WeatherSectionWeatherCard weather={null} location="Kaunas" />);
    expect(screen.getByText('Kaunas')).toBeInTheDocument();
  });
});

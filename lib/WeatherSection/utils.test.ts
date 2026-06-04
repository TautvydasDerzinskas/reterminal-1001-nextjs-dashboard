import { getWeatherDescription, getWeatherIcon } from './utils';

describe('getWeatherDescription', () => {
  it('returns "Clear" for code 0', () => {
    expect(getWeatherDescription(0)).toBe('Clear');
  });

  it('returns "Cloudy" for code 1', () => {
    expect(getWeatherDescription(1)).toBe('Cloudy');
  });

  it('returns "Cloudy" for code 2', () => {
    expect(getWeatherDescription(2)).toBe('Cloudy');
  });

  it('returns "Overcast" for code 3', () => {
    expect(getWeatherDescription(3)).toBe('Overcast');
  });

  it('returns "Foggy" for code 45', () => {
    expect(getWeatherDescription(45)).toBe('Foggy');
  });

  it('returns "Foggy" for code 48', () => {
    expect(getWeatherDescription(48)).toBe('Foggy');
  });

  it('returns "Rainy" for code 51 (drizzle boundary)', () => {
    expect(getWeatherDescription(51)).toBe('Rainy');
  });

  it('returns "Rainy" for code 67 (rain boundary)', () => {
    expect(getWeatherDescription(67)).toBe('Rainy');
  });

  it('returns "Snowy" for code 71 (snow boundary)', () => {
    expect(getWeatherDescription(71)).toBe('Snowy');
  });

  it('returns "Snowy" for code 85', () => {
    expect(getWeatherDescription(85)).toBe('Snowy');
  });

  it('returns "Stormy" for code 95', () => {
    expect(getWeatherDescription(95)).toBe('Stormy');
  });

  it('returns "Stormy" for code 96', () => {
    expect(getWeatherDescription(96)).toBe('Stormy');
  });

  it('returns "Stormy" for code 99', () => {
    expect(getWeatherDescription(99)).toBe('Stormy');
  });

  it('returns "Unknown" for an unrecognised code', () => {
    expect(getWeatherDescription(999)).toBe('Unknown');
  });

  it('returns "Unknown" for a code between rain and snow range (68–70)', () => {
    expect(getWeatherDescription(68)).toBe('Unknown');
  });
});

describe('getWeatherIcon', () => {
  it('returns a React element for every known description', () => {
    const descriptions = ['Clear', 'Cloudy', 'Overcast', 'Foggy', 'Rainy', 'Snowy', 'Stormy'];
    for (const desc of descriptions) {
      const icon = getWeatherIcon(desc);
      expect(icon).not.toBeNull();
      expect(typeof icon).toBe('object');
    }
  });

  it('returns a fallback element for unknown descriptions', () => {
    const icon = getWeatherIcon('Unknown');
    expect(icon).not.toBeNull();
    expect(typeof icon).toBe('object');
  });
});

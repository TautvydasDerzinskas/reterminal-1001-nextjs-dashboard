import { addWorkdays, dayOfWeek, resolveDayLabel, todayStr } from './utils';

describe('dayOfWeek', () => {
  it('returns 1 for a Monday', () => {
    expect(dayOfWeek('2026-06-08')).toBe(1); // Monday
  });

  it('returns 5 for a Friday', () => {
    expect(dayOfWeek('2026-06-05')).toBe(5); // Friday
  });

  it('returns 6 for a Saturday', () => {
    expect(dayOfWeek('2026-06-06')).toBe(6);
  });

  it('returns 0 for a Sunday', () => {
    expect(dayOfWeek('2026-06-07')).toBe(0);
  });
});

describe('addWorkdays', () => {
  afterEach(() => jest.useRealTimers());

  it('adds 1 workday from Monday → Tuesday', () => {
    expect(addWorkdays('2026-06-08', 1)).toBe('2026-06-09');
  });

  it('adds 1 workday from Friday → Monday (skips weekend)', () => {
    expect(addWorkdays('2026-06-05', 1)).toBe('2026-06-08');
  });

  it('adds 1 workday from Saturday → Monday', () => {
    expect(addWorkdays('2026-06-06', 1)).toBe('2026-06-08');
  });

  it('adds 1 workday from Sunday → Monday', () => {
    expect(addWorkdays('2026-06-07', 1)).toBe('2026-06-08');
  });

  it('adds 3 workdays from Wednesday → Monday (skips weekend)', () => {
    expect(addWorkdays('2026-06-10', 3)).toBe('2026-06-15');
  });

  it('returns same day when adding 0 workdays', () => {
    expect(addWorkdays('2026-06-08', 0)).toBe('2026-06-08');
  });
});

describe('resolveDayLabel', () => {
  afterEach(() => jest.useRealTimers());

  it('returns "Today" for today', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));
    expect(resolveDayLabel(todayStr())).toBe('Today');
  });

  it('returns "Tomorrow" for next calendar day', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));
    // todayStr() in Europe/Warsaw will be 2026-06-08, tomorrow is 2026-06-09
    const today = todayStr();
    const [y, m, d] = today.split('-').map(Number);
    const tomorrow = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().split('T')[0];
    expect(resolveDayLabel(tomorrow)).toBe('Tomorrow');
  });

  it('returns day name for dates further ahead', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z')); // Monday
    expect(resolveDayLabel('2026-06-10')).toBe('Wednesday');
    expect(resolveDayLabel('2026-06-15')).toBe('Monday');
  });
});

describe('todayStr', () => {
  afterEach(() => jest.useRealTimers());

  it('returns YYYY-MM-DD format', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-08T10:00:00Z'));
    expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

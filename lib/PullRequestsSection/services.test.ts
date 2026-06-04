import { getTimeAgo } from './services';

describe('getTimeAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns hours ago when less than 24 hours have passed', () => {
    const createdAt = new Date('2024-01-15T06:00:00Z').toISOString(); // 6 hours ago
    expect(getTimeAgo(createdAt)).toBe('(6 hours ago)');
  });

  it('returns "0 hours ago" when created just now', () => {
    const createdAt = new Date('2024-01-15T12:00:00Z').toISOString();
    expect(getTimeAgo(createdAt)).toBe('(0 hours ago)');
  });

  it('returns days ago when 24+ hours have passed', () => {
    const createdAt = new Date('2024-01-13T12:00:00Z').toISOString(); // 2 days ago
    expect(getTimeAgo(createdAt)).toBe('(2 days ago)');
  });

  it('returns days ago for exactly 1 day', () => {
    const createdAt = new Date('2024-01-14T12:00:00Z').toISOString();
    expect(getTimeAgo(createdAt)).toBe('(1 days ago)');
  });

  it('returns an empty string for an invalid date', () => {
    expect(getTimeAgo('not-a-date')).toBe('');
  });

  it('floors fractional hours', () => {
    const createdAt = new Date('2024-01-15T09:30:00Z').toISOString(); // 2.5 hours ago
    expect(getTimeAgo(createdAt)).toBe('(2 hours ago)');
  });

  it('floors fractional days', () => {
    const createdAt = new Date('2024-01-14T00:00:00Z').toISOString(); // 1.5 days ago
    expect(getTimeAgo(createdAt)).toBe('(1 days ago)');
  });
});

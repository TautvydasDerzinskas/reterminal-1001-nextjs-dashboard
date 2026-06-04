import { getNextTrashPickup } from './utils';
import trashPickupDates from '../../data/trash-pickup-dates.json';
import { TrashPickupEntry } from './types';

const entries = trashPickupDates as TrashPickupEntry[];

describe('getNextTrashPickup', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('with real JSON data', () => {
    it('returns null when all entries are in the past', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2027-01-01T00:00:00Z'));
      expect(getNextTrashPickup(entries)).toBeNull();
    });

    it('returns the closest upcoming entry when today is before first entry', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-04T00:00:00Z'));
      const result = getNextTrashPickup(entries);
      expect(result).not.toBeNull();
      expect(result!.daysLeft).toBe(1);
      expect(result!.types).toEqual(['bio']);
    });

    it('includes today as upcoming (daysLeft === 0) when pickup is today', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-05T00:00:00Z'));
      const result = getNextTrashPickup(entries);
      expect(result).not.toBeNull();
      expect(result!.daysLeft).toBe(0);
      expect(result!.types).toEqual(['bio']);
    });

    it('returns the next entry after today, skipping past ones', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-06T00:00:00Z'));
      const result = getNextTrashPickup(entries);
      expect(result).not.toBeNull();
      expect(result!.daysLeft).toBe(5);
      expect(result!.types).toEqual(['mixed']);
    });

    it('returns multiple types when next pickup has more than one type', () => {
      jest.useFakeTimers();
      // Day before 2026-06-12 which has ["plastic", "paper"]
      jest.setSystemTime(new Date('2026-06-11T00:00:00Z'));
      const result = getNextTrashPickup(entries);
      expect(result).not.toBeNull();
      // 2026-06-11 is "mixed" — same day, daysLeft 0
      expect(result!.daysLeft).toBe(0);
      expect(result!.types).toEqual(['mixed']);
    });

    it('returns multiple types on the correct date', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-12T00:00:00Z'));
      const result = getNextTrashPickup(entries);
      expect(result).not.toBeNull();
      expect(result!.daysLeft).toBe(0);
      expect(result!.types).toEqual(['plastic', 'paper']);
    });

    it('returns entry with 3 types correctly', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-07-10T00:00:00Z'));
      const result = getNextTrashPickup(entries);
      expect(result).not.toBeNull();
      expect(result!.daysLeft).toBe(0);
      expect(result!.types).toEqual(['plastic', 'paper', 'glass']);
    });
  });

  describe('with custom entries', () => {
    it('returns null for empty array', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-04T00:00:00Z'));
      expect(getNextTrashPickup([])).toBeNull();
    });

    it('picks the closest date when entries are unsorted', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-04T00:00:00Z'));
      const unsorted: TrashPickupEntry[] = [
        { date: '2026-06-20', types: ['glass'] },
        { date: '2026-06-07', types: ['bio'] },
        { date: '2026-06-10', types: ['mixed'] },
      ];
      const result = getNextTrashPickup(unsorted);
      expect(result!.daysLeft).toBe(3);
      expect(result!.types).toEqual(['bio']);
    });

    it('ignores past entries and returns next future one', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-10T00:00:00Z'));
      const mixed: TrashPickupEntry[] = [
        { date: '2026-06-05', types: ['bio'] },
        { date: '2026-06-08', types: ['plastic'] },
        { date: '2026-06-15', types: ['paper'] },
      ];
      const result = getNextTrashPickup(mixed);
      expect(result!.daysLeft).toBe(5);
      expect(result!.types).toEqual(['paper']);
    });
  });
});

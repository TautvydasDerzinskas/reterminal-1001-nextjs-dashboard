import { TrashPickupEntry, NextTrashPickup } from './types';

export function getNextTrashPickup(entries: TrashPickupEntry[]): NextTrashPickup | null {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const upcoming = entries
    .map((entry) => ({ ...entry, dateObj: new Date(entry.date) }))
    .filter(({ dateObj }) => dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (upcoming.length === 0) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const first = upcoming[0];
  const firstDaysLeft = Math.round((first.dateObj.getTime() - today.getTime()) / msPerDay);

  // If today has a pickup and tomorrow also has one, skip to tomorrow's after midday
  if (firstDaysLeft === 0 && upcoming.length > 1) {
    const second = upcoming[1];
    const secondDaysLeft = Math.round((second.dateObj.getTime() - today.getTime()) / msPerDay);
    if (secondDaysLeft === 1 && now.getHours() >= 12) {
      return { daysLeft: 1, types: second.types };
    }
  }

  return { daysLeft: firstDaysLeft, types: first.types };
}

import { TrashPickupEntry, NextTrashPickup } from './types';

export function getNextTrashPickup(entries: TrashPickupEntry[]): NextTrashPickup | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = entries
    .map((entry) => ({ ...entry, dateObj: new Date(entry.date) }))
    .filter(({ dateObj }) => dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.round((next.dateObj.getTime() - today.getTime()) / msPerDay);

  return { daysLeft, types: next.types };
}

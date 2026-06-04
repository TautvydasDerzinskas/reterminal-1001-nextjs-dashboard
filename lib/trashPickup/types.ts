export type TrashType = 'plastic' | 'bio' | 'paper' | 'mixed' | 'glass';

export interface TrashPickupEntry {
  date: string;
  types: TrashType[];
}

export interface NextTrashPickup {
  daysLeft: number;
  types: TrashType[];
}

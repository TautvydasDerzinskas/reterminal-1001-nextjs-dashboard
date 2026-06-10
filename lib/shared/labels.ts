// ─────────────────────────────────────────────────────────────────────────────
// All user-visible text labels used in the dashboard image.
// Centralised here so copy changes never require touching component logic.
// ─────────────────────────────────────────────────────────────────────────────

export const labels = {
  // Errors
  deviceLoadFailed: 'Failed to load device data',
  weatherLoadFailed: 'Failed to load weather',
  dashboardImageFailed: 'Failed to generate dashboard image',

  // Pull Requests card
  pendingPRs: (count: number) => `Pending PRs (${count})`,
  noPendingReviews: 'No pending reviews',
  morePRs: (count: number) => `... and ${count} more`,

  // Weather card
  today: 'Today',
  tomorrow: 'Tomorrow',
  now: 'Now',
  tempSeparator: '°C / ',
  humidity: '%',

  // Trash pickup card
  trashPickupTitle: 'Next Pickup',
  trashPickupDays: (n: number) => n === 1 ? 'day' : 'days',
  trashPickupToday: 'Today!',
  trashPickupTomorrow: 'Tomorrow!',
  trashPickupNone: 'No upcoming pickups',
  trashTypes: {
    plastic: 'Plastic',
    bio: 'Bio',
    paper: 'Paper',
    mixed: 'Mixed',
    glass: 'Glass',
  },

  // Calendar events card
  calendarNoEvents: 'No upcoming events',
  calendarNow: 'NOW',
  calendarEventSoon: '< 1h',
  calendarEventHours: (h: number) => `${h}h`,
  calendarEventDays: (d: number) => `${d}d`,
  moreCalendarEvents: (n: number) => `... and ${n} more`,
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const,

  // Time / date format locale
  timeLocale: 'en-US',
  timeZone: 'Europe/Warsaw',
} as const;

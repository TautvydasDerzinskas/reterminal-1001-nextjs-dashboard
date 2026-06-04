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
  tempSeparator: '°C / ',
  humidity: '%',

  // Time / date format locale
  timeLocale: 'en-US',
  timeZone: 'Europe/Warsaw',
} as const;

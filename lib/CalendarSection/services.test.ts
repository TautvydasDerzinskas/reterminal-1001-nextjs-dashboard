import { fetchCalendarEvents } from './services';

const MOCK_ENV = {
  GOOGLE_CALENDAR_ID: 'test@example.com',
  GOOGLE_CLIENT_ID: 'client-id',
  GOOGLE_CLIENT_SECRET: 'client-secret',
  GOOGLE_REFRESH_TOKEN: 'refresh-token',
};

function mockFetch(responses: { ok: boolean; body: unknown }[]) {
  let call = 0;
  global.fetch = jest.fn().mockImplementation(() => {
    const r = responses[call++] ?? responses[responses.length - 1];
    return Promise.resolve({
      ok: r.ok,
      status: r.ok ? 200 : 400,
      json: () => Promise.resolve(r.body),
    });
  });
}

function makeItem(startISO: string, endISO: string, summary = 'Meeting') {
  return { summary, start: { dateTime: startISO }, end: { dateTime: endISO } };
}

describe('fetchCalendarEvents', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ...MOCK_ENV };
    jest.useFakeTimers();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('returns empty when env vars are missing', async () => {
    process.env = { ...originalEnv };
    const result = await fetchCalendarEvents();
    expect(result.events).toHaveLength(0);
  });

  it('returns todays events with dayLabel "Today"', async () => {
    // Monday 2026-06-08 09:00 UTC (11:00 Warsaw)
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));

    const item = makeItem('2026-06-08T12:00:00+02:00', '2026-06-08T13:00:00+02:00', 'Standup');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [item] } },
    ]);

    const result = await fetchCalendarEvents();
    expect(result.dayLabel).toBe('Today');
    expect(result.events).toHaveLength(1);
    expect(result.events[0].title).toBe('Standup');
    expect(result.events[0].inProgress).toBe(false);
  });

  it('filters out events that have already ended', async () => {
    // Monday 14:00 UTC (16:00 Warsaw) — after a 13:00 Warsaw end time
    jest.setSystemTime(new Date('2026-06-08T14:00:00Z'));

    const ended = makeItem('2026-06-08T10:00:00+02:00', '2026-06-08T11:00:00+02:00', 'Past');
    const upcoming = makeItem('2026-06-08T17:00:00+02:00', '2026-06-08T18:00:00+02:00', 'Future');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [ended, upcoming] } },
    ]);

    const result = await fetchCalendarEvents();
    expect(result.events).toHaveLength(1);
    expect(result.events[0].title).toBe('Future');
  });

  it('skips all-day events (no dateTime)', async () => {
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));

    const allDay = { summary: 'Holiday', start: { date: '2026-06-08' }, end: { date: '2026-06-09' } };
    const timed = makeItem('2026-06-08T10:00:00+02:00', '2026-06-08T12:00:00+02:00', 'Meeting');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [allDay, timed] } },
    ]);

    const result = await fetchCalendarEvents();
    expect(result.events).toHaveLength(1);
    expect(result.events[0].title).toBe('Meeting');
  });

  it('skips to tomorrow when today has no remaining events', async () => {
    // Monday 2026-06-08 16:00 UTC — today has no more events, Tuesday has one
    jest.setSystemTime(new Date('2026-06-08T16:00:00Z'));

    const tomorrowItem = makeItem('2026-06-09T10:00:00+02:00', '2026-06-09T11:00:00+02:00', 'Sync');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [] } },      // Monday: empty
      { ok: true, body: { items: [tomorrowItem] } }, // Tuesday: has event
    ]);

    const result = await fetchCalendarEvents();
    expect(result.dayLabel).toBe('Tomorrow');
    expect(result.events[0].title).toBe('Sync');
  });

  it('skips weekend days and lands on Monday', async () => {
    // Friday 2026-06-05 18:00 UTC — no more events, weekend should be skipped
    jest.setSystemTime(new Date('2026-06-05T18:00:00Z'));

    const mondayItem = makeItem('2026-06-08T10:00:00+02:00', '2026-06-08T11:00:00+02:00', 'Monday standup');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [] } },           // Friday: empty
      { ok: true, body: { items: [mondayItem] } },  // Monday: has event
    ]);

    const result = await fetchCalendarEvents();
    expect(result.dayLabel).toBe('Monday');
    expect(result.events[0].title).toBe('Monday standup');
  });

  it('returns empty with "Today" label when no events found within 7 attempts', async () => {
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));

    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      ...Array(7).fill({ ok: true, body: { items: [] } }),
    ]);

    const result = await fetchCalendarEvents();
    expect(result.events).toHaveLength(0);
    expect(result.dayLabel).toBe('Today');
  });

  it('marks an in-progress event correctly', async () => {
    // Monday 11:30 UTC (13:30 Warsaw) — event runs 13:00–14:00 Warsaw
    jest.setSystemTime(new Date('2026-06-08T11:30:00Z'));

    const item = makeItem('2026-06-08T13:00:00+02:00', '2026-06-08T14:00:00+02:00', 'In Progress Meeting');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [item] } },
    ]);

    const result = await fetchCalendarEvents();
    expect(result.events[0].inProgress).toBe(true);
    expect(result.events[0].title).toBe('In Progress Meeting');
  });

  it('marks a future event as not in progress', async () => {
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));

    const item = makeItem('2026-06-08T12:00:00+02:00', '2026-06-08T13:00:00+02:00', 'Future Meeting');
    mockFetch([
      { ok: true, body: { access_token: 'tok' } },
      { ok: true, body: { items: [item] } },
    ]);

    const result = await fetchCalendarEvents();
    expect(result.events[0].inProgress).toBe(false);
  });

  it('throws when token exchange fails', async () => {
    jest.setSystemTime(new Date('2026-06-08T09:00:00Z'));

    mockFetch([{ ok: false, body: { error: 'invalid_grant' } }]);

    await expect(fetchCalendarEvents()).rejects.toThrow('Token exchange failed');
  });
});

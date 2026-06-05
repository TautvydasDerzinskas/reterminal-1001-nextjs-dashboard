import { CalendarData, CalendarEvent } from './types';
import { labels } from '../shared/labels';
import { TZ, tzMidnight, todayStr, dayOfWeek, addWorkdays, resolveDayLabel } from './utils';

interface GoogleCalendarItem {
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// ─── Google Calendar fetch ────────────────────────────────────────────────────

async function fetchEventsForDate(
  accessToken: string,
  calendarId: string,
  dateStr: string,
  now: Date,
): Promise<CalendarEvent[]> {
  const dayStart = tzMidnight(dateStr);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  url.searchParams.set('timeMin', dayStart.toISOString());
  url.searchParams.set('timeMax', dayEnd.toISOString());
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Calendar API failed: ${res.status}`);

  const data = await res.json() as { items?: GoogleCalendarItem[] };

  return (data.items ?? [])
    .filter((item) => Boolean(item.start?.dateTime && item.end?.dateTime))
    .map((item) => {
      const end = new Date(item.end!.dateTime!);
      const start = new Date(item.start!.dateTime!);
      const minutesUntil = Math.floor((end.getTime() - now.getTime()) / 60_000);
      const inProgress = start.getTime() <= now.getTime();
      const time = start.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ,
      });
      return { time, title: item.summary ?? '(no title)', minutesUntil, inProgress };
    })
    // Only include events that haven't fully ended yet
    .filter((e) => e.minutesUntil > 0);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchCalendarEvents(): Promise<CalendarData> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (
    !calendarId ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REFRESH_TOKEN
  ) {
    return { events: [], dayLabel: labels.today };
  }

  const accessToken = await getAccessToken();
  const now = new Date();
  let dateStr = todayStr();

  // Walk forward through workdays until we find a day with events
  for (let attempt = 0; attempt < 7; attempt++) {
    const dow = dayOfWeek(dateStr);

    // Skip weekends entirely
    if (dow === 0 || dow === 6) {
      dateStr = addWorkdays(dateStr, 1);
      continue;
    }

    const events = await fetchEventsForDate(accessToken, calendarId, dateStr, now);

    if (events.length > 0) {
      return { events, dayLabel: resolveDayLabel(dateStr) };
    }

    // No events today — try next workday
    dateStr = addWorkdays(dateStr, 1);
  }

  return { events: [], dayLabel: labels.today };
}

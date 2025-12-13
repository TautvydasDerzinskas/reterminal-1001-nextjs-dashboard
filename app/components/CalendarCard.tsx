import { format, addDays, startOfDay, endOfDay, isBefore } from 'date-fns';

interface CalendarEvent {
  time: string;
  title: string;
  hoursUntil: number;
}

// Generate JWT token for Service Account
async function generateServiceAccountJWT(): Promise<string> {
  const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY;
  const serviceAccountEmail = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !serviceAccountEmail) {
    throw new Error('Missing Service Account credentials in environment variables');
  }

  // Parse the private key (handle escaped newlines)
  const key = privateKey.replace(/\\n/g, '\n');

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Import crypto for JWT signing
  const { createSign } = require('crypto');
  const sign = createSign('sha256');

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const message = `${encodedHeader}.${encodedPayload}`;

  sign.update(message);
  const signature = sign.sign(key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${message}.${signature}`;
}

// Get access token from JWT
async function getAccessToken(): Promise<string> {
  const jwt = await generateServiceAccountJWT();

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchGoogleCalendarEvents(): Promise<CalendarEvent[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID not set');
    return [];
  }

  try {
    // Get access token
    const accessToken = await getAccessToken();

    // Determine date range based on current time
    const now = new Date();
    const currentHour = now.getHours();

    let startTime: Date;
    let endTime: Date;

    if (currentHour >= 17) {
      // After 5 PM: show tomorrow's events
      startTime = startOfDay(addDays(now, 1));
      endTime = endOfDay(addDays(now, 1));
    } else {
      // Before 5 PM: show today's events
      startTime = now;
      endTime = endOfDay(addDays(now, 1));
    }

    // Fetch from Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `timeMin=${startTime.toISOString()}&` +
      `timeMax=${endTime.toISOString()}&` +
      `orderBy=startTime&` +
      `singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 }, // 1 hour cache
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch calendar events:', response.statusText);
      return [];
    }

    const data = await response.json();
    const events: CalendarEvent[] = [];

    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((event: any) => {
        const startDateTime = new Date(event.start.dateTime || event.start.date);

        // Only show future events
        if (isBefore(now, startDateTime)) {
          const diffMs = startDateTime.getTime() - now.getTime();
          const hoursUntil = Math.floor(diffMs / (1000 * 60 * 60));

          events.push({
            time: format(startDateTime, 'HH:mm'),
            title: event.summary || 'No title',
            hoursUntil,
          });
        }
      });
    }

    return events.slice(0, 5); // Show max 5 upcoming events
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

export default async function CalendarCard() {
  const events = await fetchGoogleCalendarEvents();

  return (
    <div className="card !p-4 !rounded-md">
      <h2 className="text-center mb-4">
        <span className="bg-black text-white rounded-md px-3 py-2">📅 Calendar</span>
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-sm">No upcoming events</p>
      ) : (
        <div className="space-y-2">
          {events.map((event, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-bold">
                {event.time} - {event.title}
              </p>
              <p className="text-xs">
                {event.hoursUntil} hour{event.hoursUntil !== 1 ? 's' : ''} away
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

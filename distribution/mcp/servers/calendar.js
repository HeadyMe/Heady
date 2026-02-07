/**
 * MCP Tool: Calendar
 * List events, create events, check availability. Supports Google Calendar.
 */
const name = 'calendar';
const description = 'Calendar: list events, create events, check availability';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['list_events', 'create_event', 'check_availability'] },
    calendar_id: { type: 'string', default: 'primary' },
    start: { type: 'string', description: 'ISO 8601 datetime' },
    end: { type: 'string', description: 'ISO 8601 datetime' },
    summary: { type: 'string' },
    description: { type: 'string' },
    attendees: { type: 'array', items: { type: 'string' } },
  },
  required: ['action'],
};

async function handler(params) {
  const token = process.env.GOOGLE_CALENDAR_TOKEN;
  if (!token) return { error: 'GOOGLE_CALENDAR_TOKEN not set. Configure OAuth2 first.' };
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const base = 'https://www.googleapis.com/calendar/v3';
  const cal = params.calendar_id || 'primary';

  switch (params.action) {
    case 'list_events': {
      const now = new Date().toISOString();
      const res = await fetch(`${base}/calendars/${cal}/events?timeMin=${now}&maxResults=20&singleEvents=true&orderBy=startTime`, { headers });
      return await res.json();
    }
    case 'create_event': {
      const event = {
        summary: params.summary,
        description: params.description || '',
        start: { dateTime: params.start },
        end: { dateTime: params.end },
        attendees: (params.attendees || []).map(e => ({ email: e })),
      };
      const res = await fetch(`${base}/calendars/${cal}/events`, { method: 'POST', headers, body: JSON.stringify(event) });
      return await res.json();
    }
    case 'check_availability': {
      const res = await fetch(`${base}/freeBusy`, {
        method: 'POST', headers,
        body: JSON.stringify({ timeMin: params.start, timeMax: params.end, items: [{ id: cal }] }),
      });
      return await res.json();
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };

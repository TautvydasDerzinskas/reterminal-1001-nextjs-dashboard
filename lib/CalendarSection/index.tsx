import { fetchCalendarEvents } from './services';
import { theme } from '../shared/theme';
import { labels } from '../shared/labels';
import { styles } from '../shared/styles';
import { CalendarIcon } from '../icons';

const MAX_VISIBLE_EVENTS = 5;

function formatTimeLeft(minutesUntil: number): string {
  if (minutesUntil < 60) return labels.calendarEventSoon;
  const days = Math.floor(minutesUntil / (60 * 24));
  if (days >= 1) return labels.calendarEventDays(days);
  return labels.calendarEventHours(Math.floor(minutesUntil / 60));
}

export const CalendarSection = async () => {
  const { events, dayLabel } = await fetchCalendarEvents().catch(
    () => ({ events: [], dayLabel: labels.today }),
  );

  return (
    <div
      style={{
        border: theme.border.card,
        borderRadius: theme.radius.card,
        overflow: 'hidden',
        backgroundColor: theme.colors.cardBackground,
        ...styles.flexRow,
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Left column: dark bg, icon + count + day label */}
      <div
        style={{
          backgroundColor: theme.colors.cardBackgroundDark,
          color: theme.colors.textInverted,
          ...styles.flexColCenter,
          justifyContent: 'center',
          padding: theme.padding.card,
          gap: '8px',
          minWidth: '80px',
        }}
      >
        <div style={{ ...styles.flexAlignCenter, gap: '8px' }}>
          <CalendarIcon size={32} color={theme.colors.textInverted} />
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: theme.fontWeights.bold,
              lineHeight: 1,
            }}
          >
            {events.length}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: theme.fontSizes.sm, textAlign: 'center' }}>
          {dayLabel}
        </div>
      </div>

      {/* Right column: event list */}
      <div
        style={{
          ...styles.flexCol,
          flex: 1,
          padding: theme.padding.card,
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {events.length > 0 ? (
          <div style={{ fontSize: theme.fontSizes.sm, ...styles.flexCol }}>
            {events.slice(0, MAX_VISIBLE_EVENTS).map((event, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontWeight: theme.fontWeights.bold, minWidth: '42px', flexShrink: 0 }}>
                  {event.time}
                </span>
                <span style={{ flex: 1, overflow: 'hidden', fontWeight: event.inProgress ? theme.fontWeights.bold : theme.fontWeights.normal }}>
                  {event.title.length > 36 ? event.title.slice(0, 36) + '…' : event.title}
                </span>
                <span style={{ color: theme.colors.text, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {event.inProgress ? labels.calendarNow : formatTimeLeft(event.minutesUntil)}
                </span>
              </div>
            ))}
            {events.length > MAX_VISIBLE_EVENTS && (
              <div style={{ display: 'flex', color: theme.colors.text }}>
                {labels.moreCalendarEvents(events.length - MAX_VISIBLE_EVENTS)}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: theme.fontSizes.sm, display: 'flex' }}>
            {labels.calendarNoEvents}
          </div>
        )}
      </div>
    </div>
  );
};

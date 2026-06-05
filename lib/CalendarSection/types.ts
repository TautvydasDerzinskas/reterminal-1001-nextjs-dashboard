export interface CalendarEvent {
  time: string;       // HH:MM in the dashboard timezone
  title: string;
  minutesUntil: number; // minutes until event ends
  inProgress: boolean; // event has started but not yet ended
}

export interface CalendarData {
  events: CalendarEvent[];
  dayLabel: string;   // e.g. "Today", "Tomorrow", "Monday"
}

interface Props {
  size?: number;
  color?: string;
}

// fe-calendar (Feather Icons)
export const CalendarIcon = ({ size = 16, color = 'currentColor' }: Props) => (
  <svg
    stroke={color}
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

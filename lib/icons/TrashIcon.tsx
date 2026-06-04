interface Props {
  size?: number;
  color?: string;
}

export const TrashIcon = ({ size = 24, color = 'currentColor' }: Props) => (
  <svg
    viewBox="0 0 24 24"
    height={size}
    width={size}
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Handle */}
    <path d="M9 3h6" />
    {/* Lid */}
    <path d="M3 6h18" />
    {/* Bin body */}
    <path d="M5 6l1.5 14a1 1 0 0 0 1 .9h9a1 1 0 0 0 1-.9L19 6" />
    {/* Vertical lines inside bin */}
    <line x1="10" y1="10" x2="10" y2="17" />
    <line x1="14" y1="10" x2="14" y2="17" />
  </svg>
);

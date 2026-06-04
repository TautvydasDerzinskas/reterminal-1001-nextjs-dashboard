interface Props {
  size?: number;
  color?: string;
}

export const TrashTruckIcon = ({ size = 24, color = 'currentColor' }: Props) => (
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
    {/* Truck body */}
    <rect x="1" y="7" width="15" height="9" rx="1" />
    {/* Cab */}
    <path d="M16 10h4l2 3v3h-6V10z" />
    {/* Rear hopper lid */}
    <path d="M4 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
    {/* Front wheel */}
    <circle cx="5" cy="18" r="2" />
    {/* Rear wheel */}
    <circle cx="17" cy="18" r="2" />
    {/* Chassis connector */}
    <line x1="7" y1="18" x2="15" y2="18" />
  </svg>
);

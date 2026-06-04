interface Props {
  size?: number;
  color?: string;
}

export const BatteryEmptyIcon = ({ size = 22, color = 'currentColor' }: Props) => (
  <svg stroke={color} fill={color} strokeWidth="0" viewBox="0 0 24 24" aria-hidden="true" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M.75 9.75a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v.038c.856.173 1.5.93 1.5 1.837v2.25c0 .907-.644 1.664-1.5 1.838v.037a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-6Zm19.5 0a1.5 1.5 0 0 0-1.5-1.5h-15a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-6Z" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

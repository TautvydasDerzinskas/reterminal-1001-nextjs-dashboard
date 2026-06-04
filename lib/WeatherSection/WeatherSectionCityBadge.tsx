import { theme } from '../shared/theme';

interface Props {
  children: React.ReactNode;
}

export const CityBadge = ({ children }: Props) => (
  <span
    style={{
      backgroundColor: theme.colors.badgeBackground,
      color: theme.colors.badgeText,
      padding: theme.padding.badge,
      borderRadius: theme.radius.badge,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.normal,
    }}
  >
    {children}
  </span>
);

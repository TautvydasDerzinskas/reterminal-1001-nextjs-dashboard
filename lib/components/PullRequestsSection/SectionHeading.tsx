import { theme } from '../../theme';

interface Props {
  children: React.ReactNode;
}

export const SectionHeading = ({ children }: Props) => (
  <h2 style={{ margin: '0 0 8px 0', fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold }}>
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
  </h2>
);

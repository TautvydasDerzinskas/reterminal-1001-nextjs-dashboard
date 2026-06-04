import { theme } from '../../theme';

interface Props {
  children: React.ReactNode;
}

export const IconRow = ({ children }: Props) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      fontWeight: theme.fontWeights.bold,
      fontSize: theme.fontSizes.md,
      marginRight: theme.gap.iconRow,
    }}
  >
    {children}
  </div>
);

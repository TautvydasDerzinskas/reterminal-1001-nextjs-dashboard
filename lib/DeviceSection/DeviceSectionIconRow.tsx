import { theme } from '../shared/theme';
import { styles } from '../shared/styles';

interface Props {
  children: React.ReactNode;
}

export const IconRow = ({ children }: Props) => (
  <div
    style={{
      ...styles.flexAlignCenter,
      fontWeight: theme.fontWeights.bold,
      fontSize: theme.fontSizes.md,
      marginRight: theme.gap.iconRow,
    }}
  >
    {children}
  </div>
);

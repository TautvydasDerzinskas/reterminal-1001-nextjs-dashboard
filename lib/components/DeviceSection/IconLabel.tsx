import { theme } from '../../theme';

interface Props {
  children: React.ReactNode;
}

export const IconLabel = ({ children }: Props) => (
  <span style={{ marginLeft: theme.padding.iconLabel }}>{children}</span>
);

import { theme } from './shared/theme';
import { styles } from './shared/styles';
import { BatteryEmptyIcon } from './icons';

interface Props {
  batteryDisplay: string;
}

export const EmptyBatteryView = ({ batteryDisplay }: Props) => (
  <div
    style={{
      width: theme.canvas.width,
      height: theme.canvas.height,
      backgroundColor: theme.colors.cardBackgroundDark,
      ...styles.flexColCenter,
      justifyContent: 'center',
      color: theme.colors.textInverted,
      gap: '12px',
    }}
  >
    <BatteryEmptyIcon size={64} color={theme.colors.textInverted} />
    <span style={{ fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold }}>
      {batteryDisplay}%
    </span>
    <span style={{ fontSize: theme.fontSizes.lg }}>Please charge the device, battery is dieing!</span>
  </div>
);

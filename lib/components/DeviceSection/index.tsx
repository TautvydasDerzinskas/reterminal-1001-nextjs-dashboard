import { DeviceData } from '../../device/types';
import { theme } from '../../theme';
import { labels } from '../../labels';
import { BatteryIcon, ClockIcon, PhpIcon, ThermometerIcon, HumidityIcon } from '../../icons';
import { IconRow } from './IconRow';
import { IconLabel } from './IconLabel';

interface Props {
  deviceData: DeviceData | null;
  batteryDisplay: string;
  firmwareDisplay: string | undefined;
  currentTime: string;
}

export const DeviceSection = ({ deviceData, batteryDisplay, firmwareDisplay, currentTime }: Props) => (
  <div
    style={{
      border: theme.border.card,
      borderRadius: theme.radius.card,
      padding: theme.padding.card,
      marginBottom: theme.gap.cardBottom,
      backgroundColor: theme.colors.cardBackgroundDark,
      color: theme.colors.textInverted,
      display: 'flex',
      flexDirection: 'column',
      fontWeight: theme.fontWeights.bold,
    }}
  >
    {deviceData ? (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* Left group: battery · time · firmware */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <IconRow>
            <BatteryIcon level={parseInt(batteryDisplay)} size={theme.iconSize.md} />
            <IconLabel>{batteryDisplay}%</IconLabel>
          </IconRow>

          <IconRow>
            <ClockIcon size={theme.iconSize.sm} />
            <IconLabel>{currentTime}</IconLabel>
          </IconRow>

          <IconRow>
            <PhpIcon size={theme.iconSize.sm} />
            <IconLabel>{firmwareDisplay}</IconLabel>
          </IconRow>
        </div>

        {/* Right group: temperature · humidity */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: theme.fontWeights.bold,
              fontSize: theme.fontSizes.md,
              marginLeft: theme.gap.iconRow,
            }}
          >
            <ThermometerIcon size={theme.iconSize.sm} />
            <IconLabel>{deviceData.temperature}</IconLabel>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: theme.fontWeights.bold,
              fontSize: theme.fontSizes.md,
              marginLeft: theme.gap.iconRow,
            }}
          >
            <HumidityIcon size={theme.iconSize.sm} />
            <IconLabel>{deviceData.humidity}</IconLabel>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textInverted, display: 'flex' }}>
        {labels.deviceLoadFailed}
      </div>
    )}
  </div>
);

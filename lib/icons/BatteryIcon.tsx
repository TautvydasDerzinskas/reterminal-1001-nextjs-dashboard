import { BatteryFullIcon } from './BatteryFullIcon';
import { BatteryHalfIcon } from './BatteryHalfIcon';
import { BatteryEmptyIcon } from './BatteryEmptyIcon';

interface Props {
  level: number;
  size?: number;
}

export const BatteryIcon = ({ level, size = 22 }: Props) => {
  if (level >= 80) return <BatteryFullIcon size={size} />;
  if (level >= 50) return <BatteryHalfIcon size={size} />;
  return <BatteryEmptyIcon size={size} />;
};

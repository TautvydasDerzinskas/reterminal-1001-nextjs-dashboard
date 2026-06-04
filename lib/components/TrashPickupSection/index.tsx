import { theme } from '../../theme';
import { labels } from '../../labels';
import { TrashIcon, TrashTruckIcon } from '../../icons';
import { NextTrashPickup } from '../../trashPickup/types';

interface Props {
  nextPickup: NextTrashPickup | null;
}

const TRASH_ICON_SIZE = 48;

export const TrashPickupSection = ({ nextPickup }: Props) => {
  if (!nextPickup) {
    return (
      <div
        style={{
          flex: 1,
          border: theme.border.card,
          borderRadius: theme.radius.card,
          padding: theme.padding.card,
          backgroundColor: theme.colors.cardBackgroundDark,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.textInverted,
        }}
      >
        <TrashIcon size={TRASH_ICON_SIZE} color={theme.colors.textInverted} />
        <div style={{ display: 'flex', fontSize: theme.fontSizes.sm, marginTop: '8px' }}>
          {labels.trashPickupNone}
        </div>
      </div>
    );
  }

  const { daysLeft, types } = nextPickup;

  const isUrgent = daysLeft <= 1;
  const bgColor = isUrgent ? theme.colors.cardBackgroundDark : theme.colors.cardBackground;
  const textColor = isUrgent ? theme.colors.textInverted : theme.colors.text;

  const typeLabel =
    types.length === 1
      ? labels.trashTypes[types[0]]
      : types.map((t) => labels.trashTypes[t]).join(', ');

  return (
    <div
      style={{
        flex: 1,
        border: theme.border.card,
        borderRadius: theme.radius.card,
        padding: theme.padding.card,
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
      }}
    >
      {daysLeft === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <TrashTruckIcon size={TRASH_ICON_SIZE} color={textColor} />
          <div
            style={{
              display: 'flex',
              fontSize: theme.fontSizes.xl,
              fontWeight: theme.fontWeights.bold,
            }}
          >
            {labels.trashPickupToday}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
          }}
        >
          <TrashIcon size={TRASH_ICON_SIZE} color={textColor} />
          <div
            style={{
              display: 'flex',
              fontSize: theme.fontSizes.xxl,
              fontWeight: theme.fontWeights.bold,
              lineHeight: 1,
            }}
          >
            {daysLeft}
          </div>
          <div style={{ display: 'flex', fontSize: theme.fontSizes.md, paddingBottom: '4px' }}>
            {labels.trashPickupDays(daysLeft)}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.bold, marginTop: '8px' }}>
        {typeLabel}
      </div>
    </div>
  );
};

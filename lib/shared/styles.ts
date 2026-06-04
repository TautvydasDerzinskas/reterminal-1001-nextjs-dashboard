import type { CSSProperties } from 'react';

export const styles = {
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as CSSProperties,

  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,

  flexColCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  } as CSSProperties,

  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
  } as CSSProperties,

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  } as CSSProperties,
} as const;

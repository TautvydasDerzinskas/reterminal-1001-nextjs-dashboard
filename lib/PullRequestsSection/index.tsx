import { PullRequest } from './types';
import { theme } from '../shared/theme';
import { labels } from '../shared/labels';
import { PullRequestsSectionPRItem } from './PullRequestsSectionPRItem';
import { PullRequestIcon } from '../icons';

const MAX_VISIBLE_PRS = 5;

interface Props {
  prs: PullRequest[];
}

export const PullRequestsSection = ({ prs }: Props) => (
  <div
    style={{
      border: theme.border.card,
      borderRadius: theme.radius.card,
      overflow: 'hidden',
      backgroundColor: theme.colors.cardBackground,
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      minHeight: 0,
    }}
  >
    {/* Left column: black background, icon + count */}
    <div
      style={{
        backgroundColor: theme.colors.cardBackgroundDark,
        color: theme.colors.textInverted,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.padding.card,
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PullRequestIcon size={32} color={theme.colors.textInverted} />
        <div style={{ display: 'flex', fontSize: '32px', fontWeight: theme.fontWeights.bold, lineHeight: 1 }}>
          {prs.length}
        </div>
      </div>
    </div>

    {/* Right column: PR list */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: theme.padding.card,
        overflow: 'hidden',
      }}
    >
      {prs.length > 0 ? (
        <div style={{ fontSize: theme.fontSizes.sm, display: 'flex', flexDirection: 'column' }}>
          {prs.slice(0, MAX_VISIBLE_PRS).map((pr) => (
            <PullRequestsSectionPRItem key={pr.number} pr={pr} />
          ))}
          {prs.length > MAX_VISIBLE_PRS && (
            <div style={{ display: 'flex' }}>{labels.morePRs(prs.length - MAX_VISIBLE_PRS)}</div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: theme.fontSizes.sm, display: 'flex' }}>{labels.noPendingReviews}</div>
      )}
    </div>
  </div>
);

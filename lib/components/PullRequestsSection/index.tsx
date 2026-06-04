import { PullRequest } from '../../pullRequests/types';
import { theme } from '../../theme';
import { labels } from '../../labels';
import { SectionHeading } from './SectionHeading';
import { PRItem } from './PRItem';

const MAX_VISIBLE_PRS = 5;

interface Props {
  prs: PullRequest[];
}

export const PullRequestsSection = ({ prs }: Props) => (
  <div
    style={{
      border: theme.border.card,
      borderRadius: theme.radius.card,
      padding: theme.padding.card,
      backgroundColor: theme.colors.cardBackground,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <SectionHeading>{labels.pendingPRs(prs.length)}</SectionHeading>

    {prs.length > 0 ? (
      <div style={{ fontSize: theme.fontSizes.sm, display: 'flex', flexDirection: 'column' }}>
        {prs.slice(0, MAX_VISIBLE_PRS).map((pr) => (
          <PRItem key={pr.number} pr={pr} />
        ))}
        {prs.length > MAX_VISIBLE_PRS && (
          <div style={{ display: 'flex' }}>{labels.morePRs(prs.length - MAX_VISIBLE_PRS)}</div>
        )}
      </div>
    ) : (
      <div style={{ fontSize: theme.fontSizes.sm, display: 'flex' }}>{labels.noPendingReviews}</div>
    )}
  </div>
);

import { PullRequest } from './types';
import { getTimeAgo } from './services';
import { theme } from '../shared/theme';
import { UserIcon } from '../icons';

interface Props {
  pr: PullRequest;
}

export const PullRequestsSectionPRItem = ({ pr }: Props) => (
  <div style={{ marginBottom: '4px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex' }}>
      <UserIcon size={theme.iconSize.sm} />
      <span style={{ marginLeft: theme.padding.iconLabel }}>
        {pr.author} {getTimeAgo(pr.created_at)}
      </span>
    </div>
    <div style={{ display: 'flex' }}>
      &gt; #{pr.number}: {pr.title}
    </div>
  </div>
);

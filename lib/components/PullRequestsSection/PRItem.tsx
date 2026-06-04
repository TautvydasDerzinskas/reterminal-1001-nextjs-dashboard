import { PullRequest } from '../../pullRequests/types';
import { getTimeAgo } from '../../pullRequests/services';
import { theme } from '../../theme';
import { UserIcon } from '../../icons';

interface Props {
  pr: PullRequest;
}

export const PRItem = ({ pr }: Props) => (
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

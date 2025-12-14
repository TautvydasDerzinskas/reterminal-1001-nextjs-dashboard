import { FaUser } from 'react-icons/fa';
import { fetchPendingReviewPRs, getTimeAgo } from './services';
import { PullRequest } from './types';

export default async function PullRequestsCard() {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;

  let prs: PullRequest[] = [];
  let error: string | null = null;

  if (!token || !username || !owner || !repo) {
    error = 'GitHub env variables not provided. Please set NEXT_PUBLIC_GITHUB_TOKEN, NEXT_PUBLIC_GITHUB_USERNAME, NEXT_PUBLIC_GITHUB_OWNER, and NEXT_PUBLIC_GITHUB_REPO in your environment variables.';
  } else {
    try {
      prs = await fetchPendingReviewPRs(token, username, owner, repo);
    } catch (err) {
      error = (err as Error).message;
    }
  }

  if (error) return <div className="card"><h2>Pending Reviews</h2><p>Error: {error}</p></div>;

  return (
    <div className="card !p-4 !rounded-md">
        <h2 className="text-center !mb-0">
            <span className="bg-black text-white rounded-md px-10 py-2">Pending PRs ({prs.length})</span>
        </h2>
      {prs.length === 0 ? (
        <p>No pending reviews</p>
      ) : (
        <>
          {prs.map(pr => (
            <a href={pr.html_url} target="_blank" rel="noopener noreferrer" key={pr.number}>
                 <div><FaUser size={16} className="inline mr-1" /> {pr.author} {getTimeAgo(pr.created_at)}</div> &gt; <strong className="ml-1">{pr.title}</strong>
            </a>
          ))}
          </>
      )}
    </div>
  );
}
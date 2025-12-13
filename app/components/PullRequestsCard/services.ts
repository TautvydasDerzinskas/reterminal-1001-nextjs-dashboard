import { PullRequest } from './types';

interface ReviewRequestNode {
  requestedReviewer: {
    login: string;
  } | null;
}

interface ReviewNode {
  author: {
    login: string;
  } | null;
  state: string;
}

export async function fetchPendingReviewPRs(token: string, username: string, owner: string, repo: string): Promise<PullRequest[]> {
  const query = `
    query($searchQuery: String!) {
      search(query: $searchQuery, type: ISSUE, first: 100) {
        edges {
          node {
            ... on PullRequest {
              number
              title
              url
              author {
                login
              }
              createdAt
              merged
              reviewRequests(first: 10) {
                nodes {
                  requestedReviewer {
                    ... on User {
                      login
                    }
                  }
                }
              }
              reviews(first: 100) {
                nodes {
                  author {
                    login
                  }
                  state
                }
              }
            }
          }
        }
      }
    }
  `;

  const searchQuery = `is:pr is:open review-requested:${username} repo:${owner}/${repo}`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { searchQuery },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PRs: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  const prs: PullRequest[] = [];

  for (const edge of data.data.search.edges || []) {
    const pr = edge.node;
    if (pr.merged) continue;

    const isDirectlyRequested = pr.reviewRequests.nodes.some((request: ReviewRequestNode) => request.requestedReviewer?.login === username);
    if (!isDirectlyRequested) continue;

    const hasApproved = pr.reviews.nodes.some((review: ReviewNode) => review.author?.login === username && review.state === 'APPROVED');
    if (hasApproved) continue;

    const parts = pr.title.split(': ');
    const afterPrefix = parts.length > 1 ? parts.slice(1).join(': ') : pr.title;
    const simplifiedTitle = afterPrefix.replace(/^\[.*?\]\s*/, '');
    prs.push({
      number: pr.number,
      title: simplifiedTitle,
      html_url: pr.url,
      author: pr.author.login,
      created_at: pr.createdAt,
    });
  }

  return prs;
}
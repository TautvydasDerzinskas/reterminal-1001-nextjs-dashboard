import React from 'react';
import { render, screen } from '@testing-library/react';
import { PullRequestsSectionPRItem } from './PullRequestsSectionPRItem';
import { PullRequest } from './types';

// Freeze time so getTimeAgo produces deterministic output
const FIXED_NOW = new Date('2024-01-15T12:00:00Z');

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

const basePR: PullRequest = {
  number: 42,
  title: 'Add dark mode support',
  html_url: 'https://github.com/org/repo/pull/42',
  author: 'jane',
  created_at: new Date('2024-01-15T06:00:00Z').toISOString(), // 6 hours ago
};

describe('PRItem', () => {
  it('renders the PR number and title', () => {
    render(<PullRequestsSectionPRItem pr={basePR} />);
    expect(screen.getByText(/#42: Add dark mode support/)).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<PullRequestsSectionPRItem pr={basePR} />);
    expect(screen.getByText(/jane/)).toBeInTheDocument();
  });

  it('renders relative time', () => {
    render(<PullRequestsSectionPRItem pr={basePR} />);
    expect(screen.getByText(/6 hours ago/)).toBeInTheDocument();
  });

  it('renders title with a colon-prefixed format (>  #number: title)', () => {
    const { container } = render(<PullRequestsSectionPRItem pr={basePR} />);
    expect(container.textContent).toContain('#42: Add dark mode support');
  });
});

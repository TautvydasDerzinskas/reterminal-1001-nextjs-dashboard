import { labels } from '../../lib/labels';

describe('labels', () => {
  describe('pendingPRs', () => {
    it('includes the count in the label', () => {
      expect(labels.pendingPRs(3)).toBe('Pending PRs (3)');
    });

    it('handles 0 PRs', () => {
      expect(labels.pendingPRs(0)).toBe('Pending PRs (0)');
    });

    it('handles large counts', () => {
      expect(labels.pendingPRs(99)).toBe('Pending PRs (99)');
    });
  });

  describe('morePRs', () => {
    it('formats the overflow message correctly', () => {
      expect(labels.morePRs(5)).toBe('... and 5 more');
    });

    it('handles 1 remaining PR', () => {
      expect(labels.morePRs(1)).toBe('... and 1 more');
    });
  });

  describe('static labels', () => {
    it('has noPendingReviews text', () => {
      expect(labels.noPendingReviews).toBe('No pending reviews');
    });

    it('has weatherLoadFailed text', () => {
      expect(labels.weatherLoadFailed).toBe('Failed to load weather');
    });

    it('has today and tomorrow labels', () => {
      expect(labels.today).toBe('Today');
      expect(labels.tomorrow).toBe('Tomorrow');
    });
  });
});

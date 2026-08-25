export interface UserReview {
  quote: string;
  name: string;
  role: string;
  company?: string;
  workload: string;
  inputTypes: string[];
  providers: string[];
  datePublished: string;
  sourceUrl?: string;
  consentConfirmed: boolean;
  featured: boolean;
}

/**
 * Publish only attributable reviews whose wording and display consent have
 * been confirmed. The landing page and JSON-LD both read this same list.
 */
export const USER_REVIEWS: UserReview[] = [];

export const FEATURED_REVIEWS = USER_REVIEWS.filter(
  (review) => review.featured && review.consentConfirmed,
).slice(0, 3);

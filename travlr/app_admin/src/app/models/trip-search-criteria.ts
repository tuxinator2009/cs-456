export type TripSortOption =
| 'relevance'
| 'price-asc'
| 'price-desc'
| 'start-asc'
| 'name-asc';

export interface TripSearchCriteria {
  keyword: string;
  resort: string;
  minPrice: number | null;
  maxPrice: number | null;
  nights: number | null;
  sort: TripSortOption;
}

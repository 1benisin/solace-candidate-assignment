export type { Advocate } from "../db/schema";

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdvocatesResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
}

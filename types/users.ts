import { UserAuth } from "./auth";

// types/users.ts
export interface UserPagination {
  currentPage: number;
  total: number;
  totalPages: number;
  limit: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  admins: number;
  laborans: number;
  regularUsers: number;
}

export interface UsersApiResponse {
  users: UserAuth[];
  pagination: UserPagination;
  stats: UserStats;
}

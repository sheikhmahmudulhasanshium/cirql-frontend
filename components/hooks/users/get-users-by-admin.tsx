// components/hooks/users/get-users-by-admin.ts
import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { Role } from '@/lib/types';

// --- Type Definitions ---
export interface AdminUser {
  _id: string;
  email?: string; // Corrected to match your provided code
  firstName?: string; // Corrected to match your provided code
  lastName?: string; // Corrected to match your provided code
  accountStatus: string;
  roles: Role[];
  lastLogin?: string | null; // Corrected to match your provided code
  is2FAEnabled: boolean;
  picture?: string;
}

export interface PaginationData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface PaginatedUsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: PaginationData;
}

export interface UserFilters {
  accountStatus?: 'active' | 'inactive' | 'banned' | string;
  search?: string;
}

// --- The Hook ---
export const useAdminUsers = (page: number, limit: number, filters: UserFilters) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // --- FIX: Wrap the fetch logic in useCallback so it has a stable identity ---
  const fetchUsers = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters.accountStatus) {
        params.append('accountStatus', filters.accountStatus);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await apiClient.get<PaginatedUsersResponse>('/users', {
        signal,
        params,
      });
      
      setUsers(response.data.data);
      setPagination(response.data.pagination);

    } catch (err) {
      if (axios.isCancel(err)) return;
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters.accountStatus, filters.search]); // Dependencies for the fetch logic

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchUsers]); // useEffect now only depends on the stable fetchUsers function

  // --- FIX: Expose a refetch function by wrapping fetchUsers ---
  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort(); // Optional: allow aborting the refetch
  }, [fetchUsers]);

  // --- FIX: Add refetch to the return object ---
  return { users, pagination, isLoading, error, refetch };
};
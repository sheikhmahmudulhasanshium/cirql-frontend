import { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
// Assuming Role is defined in lib/types or a similar shared location
import { Role } from '@/lib/types'; 

// --- Type Definitions (mirroring your backend DTOs) ---

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountStatus: string;
  roles: Role[];
  lastLogin: string | null; 
  is2FAEnabled: boolean;
  picture?: string;
  createdAt: string;
  updatedAt: string;
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

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
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
          signal: controller.signal,
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
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
    // --- FIX: Replaced complex expression with specific dependencies ---
  }, [page, limit, filters.accountStatus, filters.search]); 

  return { users, pagination, isLoading, error };
};
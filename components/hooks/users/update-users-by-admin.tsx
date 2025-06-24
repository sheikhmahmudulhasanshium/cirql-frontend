// components/hooks/users/update-users-by-admin.ts

import apiClient from '@/lib/apiClient';
import { AdminUser } from './get-users-by-admin';
import { Role } from '@/lib/types';

interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  accountStatus?: string;
}

export const updateUserRoles = async (userId: string, roles: Role[]): Promise<AdminUser> => {
  const response = await apiClient.patch<AdminUser>(`/users/${userId}/roles`, { roles });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: 'active' | 'banned' | 'inactive'): Promise<AdminUser> => {
    const payload: UpdateUserDto = { accountStatus: status };
    const response = await apiClient.patch<AdminUser>(`/users/${userId}`, payload);
    return response.data;
}

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};

// --- NEW EXPORTED FUNCTIONS ---

export const banUser = async (userId: string, reason: string): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(`/users/${userId}/ban`, { reason });
    return response.data;
};

export const unbanUser = async (userId: string): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(`/users/${userId}/unban`);
    return response.data;
};
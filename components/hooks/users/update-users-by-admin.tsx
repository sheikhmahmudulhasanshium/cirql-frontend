import apiClient from '@/lib/apiClient';
// --- FIX: Corrected the import path to be relative ---
import { AdminUser } from './get-users-by-admin'; // It's in the same folder
import { Role } from '@/lib/types';

// From your backend dto/update-user.dto.ts
interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  accountStatus?: string; // We use this for banning
}

/**
 * Updates a user's roles. Maps to PATCH /users/:id/roles
 * @param userId The ID of the user to update.
 * @param roles The new array of roles.
 * @returns The updated user document.
 */
export const updateUserRoles = async (userId: string, roles: Role[]): Promise<AdminUser> => {
  const response = await apiClient.patch<AdminUser>(`/users/${userId}/roles`, { roles });
  return response.data;
};

/**
 * Updates a user's account status (e.g., to 'banned' or 'active').
 * Maps to PATCH /users/:id
 * @param userId The ID of the user to update.
 * @param status The new account status.
 * @returns The updated user document.
 */
export const updateUserStatus = async (userId: string, status: 'active' | 'banned' | 'inactive'): Promise<AdminUser> => {
    const payload: UpdateUserDto = { accountStatus: status };
    const response = await apiClient.patch<AdminUser>(`/users/${userId}`, payload);
    return response.data;
}

/**
 * Deletes a user account. Maps to DELETE /users/:id
 * @param userId The ID of the user to delete.
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};
// components/hooks/settings/updateUserPreferences.ts
import apiClient from '@/lib/apiClient'; // Assuming apiClient.ts is in lib/
import { UserPreferencesData, UpdateUserPreferencesPayload } from '@/lib/types'; // Adjusted path
import { AxiosError } from 'axios';

const USER_PREFERENCES_RESOURCE_TYPE = "userPreferences";
const USER_PREFERENCES_RESOURCE_ID = "general";

/**
 * Updates the User Preferences settings.
 * Calls PATCH /settings/userPreferences/general
 */
export const updateUserPreferencesApi = async (
  payload: UpdateUserPreferencesPayload
): Promise<UserPreferencesData> => {
  try {
    const response = await apiClient.patch<UserPreferencesData>(
      `/settings/${USER_PREFERENCES_RESOURCE_TYPE}/${USER_PREFERENCES_RESOURCE_ID}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    if (error instanceof AxiosError && error.response) {
      const backendMessage = error.response.data?.message || error.response.data?.error;
      throw new Error(backendMessage || error.message || "Failed to update user preferences");
    } else if (error instanceof Error) {
      throw new Error(error.message || "An unknown error occurred while updating user preferences.");
    }
    throw new Error("An unknown error occurred while updating user preferences.");
  }
};
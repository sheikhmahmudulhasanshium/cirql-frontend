// components/hooks/settings/fetchUserPreferences.ts
import apiClient from '@/lib/apiClient'; // Assuming apiClient.ts is in lib/
import { UserPreferencesData } from '@/lib/types'; // Adjusted path based on your body.tsx import
import { AxiosError } from 'axios';

/**
 * Fetches the User Preferences settings for a given user ID.
 * Calls GET /settings/:userId
 * This will create the userPreferences document with defaults if it doesn't exist.
 */
export const fetchUserPreferencesApi = async (userId: string): Promise<UserPreferencesData> => {
  if (!userId) {
    throw new Error("User ID is required to fetch user preferences.");
  }

  try {
    const response = await apiClient.get<UserPreferencesData>(`/settings/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    if (error instanceof AxiosError && error.response) {
      const backendMessage = error.response.data?.message || error.response.data?.error;
      throw new Error(backendMessage || error.message || "Failed to fetch user preferences");
    } else if (error instanceof Error) {
      throw new Error(error.message || "An unknown error occurred while fetching user preferences.");
    }
    throw new Error("An unknown error occurred while fetching user preferences.");
  }
};
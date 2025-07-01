'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import apiClient from '@/lib/apiClient';

// The interval at which we send a heartbeat to the backend (e.g., every 60 seconds).
const HEARTBEAT_INTERVAL_MS = 60 * 1000;

/**
 * A hook that runs in the background for authenticated users,
 * periodically sending a "heartbeat" to the backend to track screen time.
 */
export const useActivityHeartbeat = () => {
  const { state: authState } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to send the heartbeat API call
    const sendHeartbeat = () => {
      // Don't send if the browser tab is not visible
      if (document.hidden) {
        return;
      }
      
      apiClient.post('/activity/heartbeat', {
        durationMs: HEARTBEAT_INTERVAL_MS,
      }).catch(err => {
        // We catch errors silently. A failed heartbeat should not interrupt the user.
        console.error("Heartbeat failed:", err.message);
      });
    };

    // --- Setup and Teardown Logic ---
    const clearTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // If the user is authenticated, start the timer.
    if (authState.status === 'authenticated') {
      // Clear any previous timer before setting a new one
      clearTimer();
      // Set a new timer that calls sendHeartbeat periodically
      timerRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    } else {
      // If the user logs out or the session ends, clear the timer.
      clearTimer();
    }

    // This is the cleanup function. It runs when the component unmounts
    // or when the authState changes, ensuring no memory leaks.
    return () => {
      clearTimer();
    };
  }, [authState.status]); // The effect re-runs only when the auth status changes.
};

// --- FIX: The default export was incorrect in the prompt. This file only exports the named hook. ---
// Note: If you have a file that needs a default export, it should be added, but this hook is typically used as a named import.
// src/utils/storage.ts
import { createMMKV } from 'react-native-mmkv';

// Initialize MMKV storage - use default instance
export const storage = createMMKV();

// Storage keys
export const STORAGE_KEYS = {
  USER_EMAIL: 'user_email',
  USER_ID: 'user_id',
  IS_LOGGED_IN: 'is_logged_in',
} as const;

interface UserInfo {
  userId: string | undefined;
  email: string | undefined;
  isLoggedIn: boolean;
}

// Helper functions
export const StorageService = {
  // Save user login info
  saveUserInfo: (userId: string, email: string): void => {
    storage.set(STORAGE_KEYS.USER_ID, userId);
    storage.set(STORAGE_KEYS.USER_EMAIL, email);
    storage.set(STORAGE_KEYS.IS_LOGGED_IN, true);
  },

  // Get user info
  getUserInfo: (): UserInfo => {
    return {
      userId: storage.getString(STORAGE_KEYS.USER_ID),
      email: storage.getString(STORAGE_KEYS.USER_EMAIL),
      isLoggedIn: storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false,
    };
  },

  // Clear user info (logout)
  clearUserInfo: (): void => {
    storage.remove(STORAGE_KEYS.USER_ID);
    storage.remove(STORAGE_KEYS.USER_EMAIL);
    storage.set(STORAGE_KEYS.IS_LOGGED_IN, false);
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false;
  },
};
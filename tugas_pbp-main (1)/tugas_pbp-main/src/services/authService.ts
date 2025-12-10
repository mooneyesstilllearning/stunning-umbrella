// src/services/authService.ts
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { StorageService } from '../utils/storage';

interface AuthResult {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  error?: string;
}

interface LogoutResult {
  success: boolean;
  error?: string;
}

export const AuthService = {
  // Register new user
  register: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      
      // Save to MMKV
      if (userCredential.user.email) {
        StorageService.saveUserInfo(
          userCredential.user.uid,
          userCredential.user.email
        );
      }
      
      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Login existing user
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      
      // Save to MMKV
      if (userCredential.user.email) {
        StorageService.saveUserInfo(
          userCredential.user.uid,
          userCredential.user.email
        );
      }
      
      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout
  logout: async (): Promise<LogoutResult> => {
    try {
      await auth().signOut();
      StorageService.clearUserInfo();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get current user
  getCurrentUser: (): FirebaseAuthTypes.User | null => {
    return auth().currentUser;
  },

  // Check auth state
  onAuthStateChanged: (callback: (user: FirebaseAuthTypes.User | null) => void): (() => void) => {
    return auth().onAuthStateChanged(callback);
  },
};

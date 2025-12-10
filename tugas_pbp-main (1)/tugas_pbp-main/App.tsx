// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import LoginScreen from './src/screens/LoginScreen.tsx';
import StudentListScreen from './src/screens/StudentListScreen.tsx';
import { AuthService } from './src/services/authService';
import { StorageService } from './src/utils/storage.ts';

// Define your stack param list
type RootStackParamList = {
  Login: undefined;
  StudentList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state from MMKV
    const storedLoginState = StorageService.isLoggedIn();
    setIsLoggedIn(storedLoginState);
    setLoading(false);

    // Listen to auth state changes
    const unsubscribe = AuthService.onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
      if (user && user.email) {
        setIsLoggedIn(true);
        // Update MMKV
        StorageService.saveUserInfo(user.uid, user.email);
      } else {
        setIsLoggedIn(false);
        // Clear MMKV
        StorageService.clearUserInfo();
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="StudentList" component={StudentListScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;

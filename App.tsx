import React, { useEffect, useState, createContext } from 'react';

import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';

import DeviceInfo from 'react-native-device-info';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FlashMessage from 'react-native-flash-message';

import AuthStack from './src/navigation/AuthStack';

import { getStorageData, STORAGE_KEYS } from './src/utils/storage';
import RoleBasedStack from './src/navigation/RoleBasedStack';
import Orientation from 'react-native-orientation-locker';

export const AuthContext = createContext<any>(null);

const App = () => {
  const { width, height } = Dimensions.get('window');

  const isLargeScreen = Math.min(width, height) >= 600;

  const isTablet = DeviceInfo.isTablet() && isLargeScreen;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null);

  /* ---------------- CHECK LOGIN ---------------- */
  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const data = await getStorageData(STORAGE_KEYS.LOGIN_DATA);
        console.log('Login Data:', data);

        if (data?.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

        if (data?.role) {
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, [isLoggedIn]);

  /* ---------------- LOADING STATE ---------------- */

  if (isLoggedIn === null) {
    return null; // later splash screen add here
  }

  /* ---------------- TABLET CHECK ---------------- */

  if (!isTablet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tablet Only Application</Text>

        <Text style={styles.message}>
          This application is supported only on tablets.
        </Text>
      </View>
    );
  }

  /* ---------------- MAIN APP ---------------- */
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
      }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          {isLoggedIn ? <RoleBasedStack /> : <AuthStack />}
        </NavigationContainer>

        <FlashMessage
          position="bottom"
          floating
          style={styles.massageCotanier}
        />
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  massageCotanier: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 60 : 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

function removeStorageData(LOGIN_DATA: string) {
  throw new Error('Function not implemented.');
}

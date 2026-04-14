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
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/store';
import {
  clearError,
  clearSuccess,
  updateState,
} from './src/store/slices/commonSlice';
import CommonLoader from './src/components/CommonLoader';
import { showToast } from './src/components/common/showToast';

export const AuthContext = createContext<any>(null);

const AppWrapper = () => {
  const { width, height } = Dimensions.get('window');
  const isLargeScreen = Math.min(width, height) >= 600;
  const isTablet = DeviceInfo.isTablet() && isLargeScreen;
  const [userDetails, setUserDetails] = useState<any>(null);
  const dispatch = useDispatch();
  const { error, success, loading } = useSelector((state: any) => state.common);

  useEffect(() => {
    if (error) {
      showToast(error, 'danger');
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      showToast(success, 'success');
      dispatch(clearSuccess());
    }
  }, [success]);

  /* ---------------- CHECK LOGIN ---------------- */
  useEffect(() => {
    Orientation.lockToLandscape();
    Orientation.getOrientation(() => {});
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const data = await getStorageData(STORAGE_KEYS.LOGIN_DATA);

        if (data?.isLoggedIn) {
          setUserDetails(data);
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        dispatch(updateState({ isLogin: false }));
        setUserDetails(null);
      }
    };
    checkLogin();
  }, []);

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
        userDetails,
        setUserDetails,
      }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          {userDetails ? <RoleBasedStack /> : <AuthStack />}
        </NavigationContainer>
        {loading && <CommonLoader visible={loading} />}
        <FlashMessage
          position="bottom"
          floating
          style={styles.massageCotanier}
        />
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
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

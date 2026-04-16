import AsyncStorage from '@react-native-async-storage/async-storage';

/* ---------------- STORAGE KEYS ---------------- */

export const STORAGE_KEYS = {
  LOGIN_DATA: 'LOGIN_DATA',
  TOKEN: 'TOKEN',
  HOUSE_HOLD_DATA: 'HOUSE_HOLD_DATA',
};

/* ---------------- SAVE DATA ---------------- */

export const setStorageData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);

    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log('Storage Set Error:', error);
  }
};

/* ---------------- GET DATA ---------------- */

export const getStorageData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log('Storage Get Error:', error);

    return null;
  }
};

/* ---------------- REMOVE DATA ---------------- */

export const removeStorageData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Storage Remove Error:', error);
  }
};

/* ---------------- CLEAR ALL ---------------- */

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log('Storage Clear Error:', error);
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
const tokenKey = "@token_key";
export const setToken = async (value: string) => {
  try {
    await AsyncStorage.setItem(tokenKey, value);
  } catch (e) {
    // saving error
  }
};
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem(tokenKey);
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(tokenKey);
  } catch (e) {
    // error reading value
  }
};

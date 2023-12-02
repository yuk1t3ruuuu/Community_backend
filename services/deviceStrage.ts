import AsyncStorage from '@react-native-async-storage/async-storage';

const JWT_KEY = 'jwt_key'

export const deviceStorage = {
  async saveItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async saveJWT(token: string) {
    try {
      await AsyncStorage.setItem(JWT_KEY, token);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem(JWT_KEY);
      return value;
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
      return error;
    }
  },

  async deleteJWT() {
    try {
      await AsyncStorage.removeItem(JWT_KEY);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },
};
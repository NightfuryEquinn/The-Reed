import AsyncStorage from "@react-native-async-storage/async-storage"

export const userStorage = {
  getUser: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('user_session');
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  },

  setUser: async (user: { id: string, email: string, username: string, userType: string }) => {
    try {
      await AsyncStorage.setItem('user_session', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user session:', error);
    }
  },
  
  removeUser: async () => {
    try {
      await AsyncStorage.removeItem('user_session')
    } catch (error) {
      console.error('Error removing user session:', error)
    }
  }
}

export const tokenStorage = {
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('access_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
};
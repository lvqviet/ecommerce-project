import AsyncStorage from "@react-native-async-storage/async-storage";

export default {
  get: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  },

  getAllKeys: async () => AsyncStorage.getAllKeys(),

  set: async (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),

  remove: async (key) => AsyncStorage.removeItem(key),

  clear: async () => AsyncStorage.clear(),

  clearWithout: async (args = []) => {
    const allKeys = await AsyncStorage.getAllKeys();
    for (const key of allKeys) {
      if (!args.includes(key)) {
        await AsyncStorage.removeItem(key);
      }
    }
  },
};

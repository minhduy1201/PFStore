import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const API_BASE_URL = "https://f8f5-14-241-170-199.ngrok-free.app/api";

// Tạo một instance của axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Logout = async (navigation) => {
  try {
    // Xoá token và userId khỏi AsyncStorage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("user_current");
    navigation.replace("Login");
    Alert.alert("Thông báo", "Đã đăng xuất thành công");
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

// Interceptor để tự động thêm token vào header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm xử lý lỗi chung
export const handleApiError = (error, defaultMessage) => {
  if (error.response && error.response.data) {
    const message = error.response.message || defaultMessage;
    Alert.alert("Lỗi", message, [
      {
        text: "OK",
        onPress: () => console.log(message),
      },
    ]);
  } else {
    Alert.alert("Lỗi", defaultMessage, [
      {
        text: "OK",
        onPress: () => console.log(defaultMessage),
      },
    ]);
  }
};

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const API_BASE_URL = "https://be73-42-112-78-124.ngrok-free.app/api";

// Tạo một instance của axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    Alert.alert("Thông báo", "Đã đăng xuất thành công");
    navigation.replace("Login");
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

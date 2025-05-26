import { api, handleApiError } from "./connection";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm đăng nhập
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/Auth/login", { email, password });
    const { token } = response.data;
    await AsyncStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    handleApiError(error, "Đăng nhập thất bại");
    return null;
  }
};

// Hàm đăng ký
export const registerUser = async (fullName, email, password, phoneNumber) => {
  try {
    const response = await api.post("/Auth/register", {
      fullName,
      email,
      password,
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Đăng ký thất bại");
    return null;
  }
};

// Xác minh OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/Auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    handleApiError(error, "Xác minh OTP thất bại");
    return null;
  }
};

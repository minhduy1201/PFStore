import { api, handleApiError } from "./connection";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm đăng nhập
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/Auth/login", { email, password });
    //laaysthoong tin token và user
    const { token, user } = response.data;
    await AsyncStorage.setItem("token", token);
    //lưu userId
    await AsyncStorage.setItem("userId", String(user.userId));
    //lưu thông tin của ngươi dùng hiện tại
    await AsyncStorage.setItem("current_user", JSON.stringify(user));

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

//lấy ra userID
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.log(error, "Không lấy dược userId từ AsyncStorage");
    return null;
  }
};

//đổi mật khẩu (dùng trong phần profile)
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.put("/Auth/change-password", {
      oldPassword,
      newPassword,
    });

    // Nếu API trả về message thì trả về thành công
    return response.data?.message || "Đổi mật khẩu thành công";
  } catch (error) {
    handleApiError(error, "Đổi mật khẩu thất bại");
    return null;
  }
};
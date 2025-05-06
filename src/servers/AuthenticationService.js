import axios from 'axios';

const API_URL = 'http://192.168.0.108:5188/api/auth';

export const registerUser = async (fullName, email, password, phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      fullName,
      email,
      password,
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

import { api, handleApiError } from "./connection";

// Hàm lấy danh sách địa chỉ của người dùng
export const getUserAddresses = async (userId) => {
  try {
    const response = await api.get(`/UserAddresses/user/${userId}`);
    console.log("Danh sách địa chỉ:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách địa chỉ.");
    return [];
  }
};

// Hàm thêm thông tin địa chỉ mới
export const addUserAddress = async (addressData) => {
  try {
    const response = await api.post("/UserAddresses", addressData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể thêm địa chỉ mới.");
    return null;
  }
};
//hàm cập nhật thông tin địa chỉ
export const updateUserAddress = async (addressId, updatedData) => {
  try {
    await api.put(`/UserAddresses/${addressId}`, updatedData);
    return true;
  } catch (error) {
    handleApiError(error, "Cập nhật địa chỉ thất bại.");
    return false;
  }
};
// Hàm xóa địa chỉ
export const deleteUserAddress = async (addressId) => {
  try {
    await api.delete(`/UserAddresses/${addressId}`);
    return true;
  } catch (error) {
    handleApiError(error, "Xoá địa chỉ thất bại.");
    return false;
  }
};
// Hàm đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
  try {
    await api.patch(`/UserAddresses/${addressId}/default`);
    return true;
  } catch (error) {
    handleApiError(error, "Không thể đặt làm địa chỉ mặc định.");
    return false;
  }
};
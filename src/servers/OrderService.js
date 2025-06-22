import { api, handleApiError } from "./connection";

// Hàm tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/Order", orderData);
    return response.data;
  } catch (error) {
    // Sử dụng hàm handleApiError để hiển thị lỗi một cách nhất quán
    handleApiError(error, "Tạo đơn hàng thất bại. Vui lòng thử lại.");
    return null;
  }
}; 
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

// Hàm lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/Order/${orderId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể lấy thông tin đơn hàng. Vui lòng thử lại.");
    return null;
  }
};

// Hàm lấy danh sách đơn hàng của người mua
export const getOrdersByBuyer = async (buyerId) => {
  try {
    const response = await api.get(`/Order/buyer/${buyerId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách đơn hàng. Vui lòng thử lại.");
    return null;
  }
};

// Hàm lấy danh sách đơn hàng của người bán
export const getOrdersBySeller = async (sellerId) => {
  try {
    const response = await api.get(`/Order/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách đơn hàng. Vui lòng thử lại.");
    return null;
  }
};

// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await api.put(`/Order/${orderId}`, statusData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    return null;
  }
};

// Hàm hủy đơn hàng
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.delete(`/Order/${orderId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể hủy đơn hàng. Vui lòng thử lại.");
    return null;
  }
}; 
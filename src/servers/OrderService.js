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

//lấy chi tiết đơn hàng
export const getOrderDetail = async (orderId) => {
  try {
    if (!orderId) {
      console.warn("ID đơn hàng không hợp lệ để lấy chi tiết.");
      throw new Error("ID đơn hàng không hợp lệ.");
    }
    const res = await api.get(`/Order/${orderId}`);
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy chi tiết đơn hàng #${orderId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

//chấp nhận đơn hàng
export const acceptOrder = async (orderId) => {
  try {
    if (!orderId) {
      console.warn("ID đơn hàng không hợp lệ để chấp nhận.");
      throw new Error("ID đơn hàng không hợp lệ.");
    }
    // Gọi API PUT: /api/Order/{orderId}/accept
    const res = await api.put(`/Order/${orderId}/accept`);
    return res.data; // Trả về thông báo thành công từ backend
  } catch (error) {
    console.error(
      `Lỗi khi chấp nhận đơn hàng #${orderId}:`,
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để component gọi có thể xử lý
  }
};

// --- HÀM MỚI: Từ chối Đơn hàng ---
export const rejectOrder = async (orderId) => {
  try {
    if (!orderId) {
      console.warn("ID đơn hàng không hợp lệ để từ chối.");
      throw new Error("ID đơn hàng không hợp lệ.");
    }
    // Gọi API PUT: /api/Order/{orderId}/reject
    const res = await api.put(`/Order/${orderId}/reject`);
    return res.data; // Trả về thông báo thành công từ backend
  } catch (error) {
    console.error(
      `Lỗi khi từ chối đơn hàng #${orderId}:`,
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để component gọi có thể xử lý
  }
};

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

// ---  Từ chối Đơn hàng ---
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
// Hàm lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/Order/${orderId}`);
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Không thể lấy thông tin đơn hàng. Vui lòng thử lại."
    );
    return null;
  }
};

// Hàm lấy danh sách đơn hàng của người mua
export const getOrdersByBuyer = async (buyerId) => {
  try {
    const response = await api.get(`/Order/buyer/${buyerId}`);
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Không thể lấy danh sách đơn hàng. Vui lòng thử lại."
    );
    return null;
  }
};

// Lấy danh sách đơn hàng của người bán
export const getSellerOrders = async (sellerId) => {
  try {
    const response = await api.get(`/Order/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Không thể lấy danh sách đơn hàng. Vui lòng thử lại."
    );
    return null;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/Order/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại."
    );
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

// lấy lịch sử giao dịch của người dùng
export const getTransactionHistoryByUser = async (userId) => {
  try {
    const response = await api.get(`/orders/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử giao dịch:", error);
    throw error;
  }
};

// Gửi yêu cầu trả hàng
export const requestReturn = async (orderId) => {
  try {
    const result = await fetch("/api/Orders/RequestReturn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token nếu cần
      },
      body: JSON.stringify({ orderId: orderId }),
    });

    if (result.status === 200) {
      // Trả về phản hồi thành côngr
      return response.data;
    } else {
      // Xử lý lỗi nếu không thành công
      throw new Error("Yêu cầu trả hàng không thành công");
    }
  } catch (error) {
    handleApiError(error); // Xử lý lỗi từ API
    throw new Error("Lỗi khi gửi yêu cầu trả hàng.");
  }
};

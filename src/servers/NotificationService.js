import { getUserId } from "./AuthenticationService";
import { api } from "./connection";

// Lấy danh sách thông báo của người dùng
export const getNotifyByUserId = async (isRead = null) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.warn("Không tìm thấy ID người dùng. Không thể lấy thông báo.");
      return []; // Trả về mảng rỗng nếu không có userId
    }

    let url = `/Notifications/user/${userId}`;
    if (isRead !== null) {
      // Chỉ thêm query param nếu isRead không phải là null
      url += `?isRead=${isRead}`;
    }

    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách thông báo cho người dùng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Xóa thông báo ---
export const deleteNotification = async (notificationId) => {
  try {
    if (!notificationId) {
      console.warn("ID thông báo không hợp lệ để xóa.");
      return false;
    }
    const res = await api.delete(`/Notifications/${notificationId}`);
    return res.data; // Trả về thông báo thành công từ API
  } catch (error) {
    console.error(
      `Lỗi khi xóa thông báo #${notificationId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Hàm đánh dấu thông báo là đã đọc
export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await api.put(`/Notifications/MarkAsRead/${notificationId}`);
    return res.data; // Trả về kết quả từ API
  } catch (error) {
    console.error(
      `Lỗi khi đánh dấu thông báo #${notificationId} là đã đọc:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

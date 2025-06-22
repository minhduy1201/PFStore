import { Alert } from "react-native";
import { getUserId } from "./AuthenticationService";
import { api } from "./connection";

//lấy sản phẩm trong giỏ hàng của người dùng
export const getCartByUserID = async () => {
  const userId = await getUserId();
  if (!userId) {
    console.log("Người dùng chưa đăng nhập hoặc chưa tìm thấy ID người dùng.");
    throw new Error("Unauthorized: User ID not available.");
  }

  try {
    const res = await api.get(`/Carts/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Không lấy được sản phẩm có trong giỏ hàng:", error);
    return []; // Luôn trả về mảng rỗng khi có lỗi
  }
};

//Thêm vào giỏ hàng
export const addCart = async (prodId, quantity) => {
  const userId = await getUserId();
  if (!userId) {
    console.log("Người dùng chưa đăng nhập hoặc chưa tìm thấy ID người dùng.");
    throw new Error("Unauthorized: User ID not available.");
  }
  const requestBody = {
    userId: userId,
    productId: prodId,
    quantity: quantity,
  };
  try {
    const res = await api.post("/Carts", requestBody);
    if (res.status === 200) {
      //nếu chưa được thêm
      if (res.data && res.data.cartItem) {
        console.log("Sản phẩm đã được thêm vào giỏ hàng:", res.data.cartItem);
        return {
          success: true,
          cartItem: res.data.cartItem,
          message: res.data.message,
        };
      } else if (res.data && res.data.message) {
        console.log("Thông báo từ giỏ hàng:", res.data.message);
        // trường hợp sản phẩm đã có sẵn
        return { success: false, message: res.data.message };
      }
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    let errorMessage = "Đã xảy ra lỗi không xác định.";
    if (error.response) {
      // Lỗi từ phía server (HTTP status code không phải 2xx)
      // Lấy thông báo lỗi được gửi từ backend
      errorMessage =
        error.response.data?.message ||
        `Lỗi máy chủ (${error.response.status}).`;
    }
    //request gửi đi nhưng không có phản hồi
    else if (error.request) {
      errorMessage =
        "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.";
    }

    throw new Error(errorMessage);
  }
};

//xóa sản phẩm trong giỏ hàng
export const deleteCart = async (cardId) => {
  if (!cardId) {
    console.error("Lỗi: Không có id để thực hiện bước xóa");
    throw new Error("Missing wishlistId for deletion.");
  }
  try {
    const res = await api.delete(`/Carts/${cardId}`);
    //Kiem tra dieu kien
    if (res.status == 204) {
      console.log(`Đã xóa giỏ hàng với id ${cardId}`);
      return true;
    }
  } catch (error) {
    console.error(`Lỗi khi xóa cartId ${cardId}:`, error);
    throw error;
  }
};

// Xóa nhiều sản phẩm khỏi giỏ hàng
export const deleteMultipleCartItems = async (cartIds) => {
  if (!cartIds || cartIds.length === 0) {
    console.log("Không có sản phẩm nào để xóa.");
    return true;
  }
  try {
    const response = await api.delete("/Carts/bulk-delete", { data: cartIds });
    if (response.status === 204) {
      console.log("Các sản phẩm đã được xóa khỏi giỏ hàng:", cartIds);
      return true;
    }
  } catch (error) {
    console.error("Lỗi khi xóa nhiều sản phẩm khỏi giỏ hàng:", error);
    // Có thể thêm xử lý lỗi cụ thể hơn ở đây nếu cần
    return false;
  }
};

//cập nhật số lượng giỏ hàng
export const updateQuantityCart = async (cartId, newQuantity) => {
  const userId = await getUserId();
  const requestBody = {
    userId: userId,
    quantity: newQuantity,
  };
  if (!cartId) {
    console.error("Lỗi: Không có id để thực hiện bước cập nhật");
    throw new Error("Missing wishlistId for deletion.");
  }
  try {
    const res = await api.put(`/Carts/${cartId}`, requestBody);
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi khi cập nhật số lượng giỏ hàng cho cartId ${cartId}:`,
      error.response?.data || error.message
    );
  }
};

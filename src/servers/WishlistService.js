import { getUserId } from "./AuthenticationService";
import { api, handleApiError } from "./connection";

//lấy danh sách sản phẩm yêu thích của người dùng
export const getWishlistByUser = async () => {
  const userId = await getUserId();
  if (!userId) {
    console.log("Người dùng chưa đăng nhập hoặc chưa tìm thấy ID người dùng.");
    throw new Error("Unauthorized: User ID not available.");
  }

  try {
    const res = await api.get(`/Wishlists/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Không lấy được sản phẩm có trong wishlist:", error);
    return []; // Luôn trả về mảng rỗng khi có lỗi
  }
};

//thêm vào danh sách yêu thích
export const addWishlist = async (productId, userId) => {
  if (!productId || !userId) {
    console.log(
      "Đầu vào không phù hợp cho việc thêm sản phẩm vào danh sách yêu thích"
    );
    return null;
  }

  try {
    const requestBody = {
      productId: productId,
      userId: userId,
    };
    const res = await api.post(`/Wishlists`, requestBody);
    if (res.status == 200 && res.data && res.data.wishlist) {
      console.log("Thêm vào danh sách yêu thích thành công");
      return res.data.wishlist;
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào wishlist:", error);
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

//xóa sp yeu thích
export const deleteWishlist = async (wishlistId) => {
  if (!wishlistId) {
    console.error("Lỗi: Không có id để thực hiện bước xóa");
    throw new Error("Missing wishlistId for deletion.");
  }
  try {
    const res = await api.delete(`/Wishlists/${wishlistId}`);
    //Kiem tra dieu kien
    if (res.status == 204) {
      console.log(`Đã xóa sản phẩm với id ${wishlistId}`);
      return true;
    }
  } catch (error) {
    console.error(`Lỗi khi xóa wishlistId ${wishlistId}:`, error);
    throw error;
  }
};

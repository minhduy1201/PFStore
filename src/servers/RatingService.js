import { api, handleApiError } from "./connection";

// Gửi đánh giá sản phẩm
export const submitRating = async (userId, productId, stars, comment) => {
  try {
    const response = await api.post("/Ratings", {
      userId: userId,
      productId: productId,
      stars: stars,
      comment: comment,
    });

    return response.data; // Trả về dữ liệu phản hồi từ backend
  } catch (error) {
    handleApiError(error); // Xử lý lỗi từ API
    throw new Error("Lỗi khi gửi đánh giá.");
  }
};

// Lấy đánh giá của sản phẩm
export const getProductRatings = async (productId) => {
  try {
    const response = await api.get(`/Ratings/product/${productId}`);
    return response.data; // Trả về các đánh giá sản phẩm
  } catch (error) {
    handleApiError(error); // Xử lý lỗi từ API
    throw new Error("Lỗi khi lấy đánh giá sản phẩm.");
  }
};
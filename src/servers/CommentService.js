import { api, handleApiError } from "./connection";

//lấy bình luận theo sản phẩm đó
export const getCommentByProId = async (productId) => {
  try {
    const res = await api.get(`/Comments/product/${productId}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleApiError("Lỗi khi lấy sản phẩm theo danh mục sản phẩm", err);
    return null;
  }
};

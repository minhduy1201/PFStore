import { getUserId } from "./AuthenticationService";
import { api, handleApiError } from "./connection";

//lấy bình luận theo sản phẩm đó
export const getCommentByProId = async (productId) => {
  try {
    const res = await api.get(`/Comments/product/${productId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy bình luận của sản phẩm");
  }
};

//thêm bình luận
export const addComment = async (pId, content, parentId) => {
  //lay userid
  uId = await getUserId();
  try {
    const bodyRequest = {
      userId: uId,
      productId: pId,
      content: content,
      parentCommentId: parentId,
    };
    const res = await api.post("/Comments", bodyRequest);
    if (res.status == 200 && res.data && res.data.comment) {
      console.log("Thêm bình luận thành công");
      return res.data.comment;
    }
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
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

//xóa bình luận
export const deleteComment = async (commentId) => {
  if (!commentId) {
    console.error("Lỗi: Không có id để thực hiện bước xóa");
    throw new Error("Missing commentId for deletion.");
  }
  try {
    const res = await api.delete(`/Comments/${commentId}`);
    //Kiem tra dieu kien
    if (res.status == 204) {
      console.log(`Đã xóa bình luận với id ${commentId}`);
      return true;
    }
  } catch (error) {
    console.error(`Lỗi khi xóa commentId ${commentId}:`, error);
    throw error;
  }
};

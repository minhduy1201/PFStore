import { api, handleApiError } from "./connection";

//Lấy danh sách các danh mục
export const GetCategories = async () => {
  try {
    const response = await api.get("/Categories");
    return response.data;
  } catch (error) {
    //handleApiError(error, "Lỗi khi lấy danh sách danh mục");
    return null;
  }
};

export const CreatePost = async (formData) => {
  try {
    const response = await api.post("/Products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm mới:", error);
    handleApiError(error, "Đăng sản phẩm mới thất bại.");
    throw error;
  }
};
//Lấy danh sách các sản phẩm
export const getProducts = async () => {
  try {
    const response = await api.get("/Products");
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi  danh sách sản phẩm");
    return null;
  }
};

//Lấy sản phẩm theo id
export const getProductById = async (productId) => {
  try {
    const res = await api.get(`/Products/${productId}`);
    // console.log(res.data);
    return res.data;
  } catch (err) {
    handleApiError(err, "Lỗi khi lây sản phẩm theo Id");
    return null;
  }
};

//Lấy sản phẩm theo catrgoryId
export const getProductByCatId = async (categoryId) => {
  try {
    const res = await api.get(`/Products/category/${categoryId}`);
    return res.data;
  } catch (error) {
    handleApiError("Lỗi khi lấy sản phẩm theo danh mục sản phẩm", error);
    return null;
  }
};


// Hàm lấy danh sách các sản phẩm do người dùng hiện tại đăng bán
export const fetchUserPosts = async (userId) => {
  try {
    const response = await api.get(`/Products/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch user posts:", error);
    handleApiError(error, "Không thể tải danh sách sản phẩm của bạn.");
    throw error;
  }
};

// Hàm xóa một sản phẩm
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/Products/${postId}`);
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    handleApiError(error, "Xóa sản phẩm thất bại.");
    throw error;
  }
};



// Thêm hàm updatePost (mock) để chuẩn bị cho màn hình chỉnh sửa
export const updatePost = async (postId, updatedProductData) => {
  try {
    const response = await api.put(`/Products/${postId}`, updatedProductData);
    return {
      message: "Sản phẩm đã được cập nhật thành công!",
      status: response.status,
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    handleApiError(error, "Cập nhật sản phẩm thất bại.");
    throw error;
  }
};




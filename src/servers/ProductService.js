import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { api, handleApiError } from "./connection";

//Lấy danh sách các danh mục
export const GetCategories = async () => {
  try {
    const response = await api.get("/Categories");
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách danh mục");
    return null;
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
    console.log("Đang lây sản phẩm từ Product");
    const res = await api.get(`/Products/${productId}`);
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
  } catch (err) {
    handleApiError(err, "Lỗi khi lấy sản phẩm theo danh mục sản phẩm");
    return null;
  }
};

// --- Dữ liệu giả lập cho danh sách sản phẩm của người dùng ---
const MOCK_USER_POSTS_DATA = [
  {
    id: "prod001",
    name: "Áo thun Champion đen đỏ size L",
    imageUrl:
      "https://via.placeholder.com/200x200/000000/FF0000?text=Champion+TShirt",
    price: 150000,
    description:
      "Áo thun Champion màu đen phối đỏ, form Raglan, size L, hàng chất lượng cao.",
    status: "Đang bán", // Ví dụ: có thêm trạng thái
  },
  {
    id: "prod002",
    name: "Jacket Champion - Hàng 2hand, legit",
    imageUrl:
      "https://via.placeholder.com/200x200/000080/FFFFFF?text=Champion+Jacket",
    price: 250000,
    description:
      "Áo khoác Champion đã qua sử dụng nhưng còn mới, hàng chính hãng.",
    status: "Đang bán",
  },
  {
    id: "prod003",
    name: "Quần jogger Nike thể thao",
    imageUrl:
      "https://via.placeholder.com/200x200/333333/FFFFFF?text=Nike+Jogger",
    price: 300000,
    description: "Quần jogger Nike chất liệu cao cấp, thoải mái khi vận động.",
    status: "Đã ẩn", // Ví dụ: sản phẩm này đã được ẩn
  },
  {
    id: "prod004",
    name: "Giày Adidas UltraBoost",
    imageUrl:
      "https://via.placeholder.com/200x200/6A5ACD/FFFFFF?text=Adidas+Shoes",
    price: 800000,
    description:
      "Giày chạy bộ Adidas UltraBoost, đế êm ái, phù hợp tập luyện hàng ngày.",
    status: "Đang bán",
  },
];

// Hàm lấy danh sách các sản phẩm do người dùng hiện tại đăng bán
export const fetchUserPosts = async () => {
  try {
    // --- MÔ PHỎNG API CALL ---
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập độ trễ 1.5 giây
    console.log("Mock API: Đang lấy danh sách sản phẩm của người dùng...");

    // Trong thực tế, bạn sẽ làm như thế này (giả sử backend có endpoint này):
    // const response = await api.get("/users/me/products"); // Hoặc /my-posts
    // return response.data.data; // Giả sử dữ liệu nằm trong response.data.data

    return MOCK_USER_POSTS_DATA; // Trả về dữ liệu giả lập
  } catch (error) {
    console.error("Lỗi khi fetch user posts (mock):", error);
    handleApiError(error, "Không thể tải danh sách sản phẩm của bạn.");
    throw error;
  }
};

// Hàm giả lập việc xóa một sản phẩm
export const deletePost = async (postId) => {
  try {
    // --- MÔ PHỎNG API CALL ---
    await new Promise((resolve) => setTimeout(resolve, 800)); // Giả lập độ trễ 0.8 giây
    console.log(`Mock API: Đang xóa sản phẩm với ID: ${postId}`);

    // Trong thực tế, bạn sẽ làm như thế này:
    // const response = await api.delete(`/posts/${postId}`); // Giả sử endpoint là /posts/{id} và phương thức DELETE
    // return response.data;

    // Giả lập kết quả thành công
    return {
      message: `Sản phẩm ${postId} đã được xóa thành công (Mock)!`,
      status: 200,
    };
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm (mock):", error);
    handleApiError(error, `Xóa sản phẩm ${postId} thất bại.`);
    throw error;
  }
};

// Thêm hàm updatePost (mock) để chuẩn bị cho màn hình chỉnh sửa
export const updatePost = async (postId, updatedProductData) => {
  try {
    // --- MÔ PHỎNG API CALL ---
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(
      `Mock API: Đang cập nhật sản phẩm ${postId}:`,
      updatedProductData
    );

    // Trong thực tế, bạn sẽ làm như thế này:
    // const response = await api.put(`/posts/${postId}`, updatedProductData);
    // return response.data;

    return {
      message: `Sản phẩm ${postId} đã được cập nhật thành công (Mock)!`,
      status: 200,
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm (mock):", error);
    handleApiError(error, `Cập nhật sản phẩm ${postId} thất bại.`);
    throw error;
  }
};

// Thêm hàm createPost (mock) để chuẩn bị cho màn hình thêm sản phẩm mới
export const createPost = async (newProductData) => {
  try {
    // --- MÔ PHỎNG API CALL ---
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newId = `prod${Date.now()}`; // Tạo ID giả
    console.log(`Mock API: Đang tạo sản phẩm mới:`, newProductData);

    // Trong thực tế, bạn sẽ làm như thế này:
    // const response = await api.post("/posts", newProductData);
    // return response.data;

    return {
      id: newId,
      ...newProductData,
      message: "Sản phẩm đã được đăng thành công (Mock)!",
    };
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm mới (mock):", error);
    handleApiError(error, "Đăng sản phẩm mới thất bại.");
    throw error;
  }
};

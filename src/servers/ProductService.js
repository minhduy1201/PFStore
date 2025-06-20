import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
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

//Lấy danh sách các thương hiệu
export const GetBrands = async () => {
  try {
    const response = await api.get("/Brands");
    return response.data;
  } catch (error) {
    handleApiError(error, "Lỗi khi lấy danh sách thương hiệu");
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
    console.log(res.data);
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
    handleApiError("Lỗi khi lấy sản phẩm theo danh mục sản phẩm", err);
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

// Mô phỏng API tìm kiếm sản phẩm theo từ khóa
export const searchProducts = async (keyword) => {
  try {
    // Giả lập độ trễ
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Mock API: Đang tìm kiếm sản phẩm theo từ khóa: ${keyword}`);

    // --- MÔ PHỎNG API CALL ---
    // Trong thực tế, bạn sẽ làm như thế này (giả sử backend có endpoint này):
    // const response = await api.get(`/Products/search?keyword=${keyword}`);
    // return response.data; // Trả về dữ liệu từ backend

    // Giả lập dữ liệu tìm kiếm
    const MOCK_SEARCH_RESULTS = [
      {
        id: "prod001",
        name: "Áo thun Champion đen đỏ size L",
        imageUrl:
          "https://via.placeholder.com/200x200/000000/FF0000?text=Champion+TShirt",
        price: 150000,
        description:
          "Áo thun Champion màu đen phối đỏ, form Raglan, size L, hàng chất lượng cao.",
      },
      {
        id: "prod002",
        name: "Jacket Champion - Hàng 2hand, legit",
        imageUrl:
          "https://via.placeholder.com/200x200/000080/FFFFFF?text=Champion+Jacket",
        price: 250000,
        description:
          "Áo khoác Champion đã qua sử dụng nhưng còn mới, hàng chính hãng.",
      },
      {
        id: "prod003",
        name: "Áo Nike thể thao",
        imageUrl: "https://via.placeholder.com/200x200/333333/FFFFFF?text=Nike+Jogger",
        price: 300000,
        description: "Áo Nike chất liệu cao cấp, thoải mái khi vận động.",

      },
    ];

    // Trả về dữ liệu giả lập
    return MOCK_SEARCH_RESULTS.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    ); // Lọc sản phẩm theo từ khóa
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    handleApiError(error, "Không thể tìm kiếm sản phẩm.");
    throw error;
  }
};

// Mô phỏng API lọc sản phẩm theo thương hiệu
export const filterProductsByBrand = async (brand) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập độ trễ
    console.log(`Mock API: Đang lọc sản phẩm theo thương hiệu: ${brand}`);

    // --- MÔ PHỎNG API CALL ---
    // Trong thực tế, bạn sẽ làm như thế này (giả sử backend có endpoint này):
    // const response = await api.get(`/Products/filter/brand?brand=${brand}`);
    // return response.data; // Trả về dữ liệu từ backend

    const MOCK_PRODUCTS = [
      {
        id: "prod001",
        name: "Áo thun Champion đen đỏ size L",
        brand: "Champion",
        imageUrl:
          "https://via.placeholder.com/200x200/000000/FF0000?text=Champion+TShirt",
        price: 150000,
      },
      {
        id: "prod002",
        name: "Jacket Champion - Hàng 2hand, legit",
        brand: "Champion",
        imageUrl:
          "https://via.placeholder.com/200x200/000080/FFFFFF?text=Champion+Jacket",
        price: 250000,
      },
      {
        id: "prod003",
        name: "Quần jogger Nike thể thao",
        brand: "Nike",
        imageUrl:
          "https://via.placeholder.com/200x200/333333/FFFFFF?text=Nike+Jogger",
        price: 300000,
      },
    ];

    return MOCK_PRODUCTS.filter(
      (product) => product.brand.toLowerCase() === brand.toLowerCase()
    );
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm theo thương hiệu:", error);
    handleApiError(error, "Không thể lọc sản phẩm theo thương hiệu.");
    throw error;
  }
};

// Mô phỏng API lọc sản phẩm theo size
export const filterProductsBySize = async (size) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập độ trễ
    console.log(`Mock API: Đang lọc sản phẩm theo size: ${size}`);

    // --- MÔ PHỎNG API CALL ---
    // Trong thực tế, bạn sẽ làm như thế này (giả sử backend có endpoint này):
    // const response = await api.get(`/Products/filter/size?size=${size}`);
    // return response.data; // Trả về dữ liệu từ backend

    const MOCK_PRODUCTS = [
      {
        id: "prod001",
        name: "Áo thun Champion đen đỏ size L",
        size: "L",
        imageUrl:
          "https://via.placeholder.com/200x200/000000/FF0000?text=Champion+TShirt",
        price: 150000,
      },
      {
        id: "prod002",
        name: "Jacket Champion - Hàng 2hand, legit",
        size: "M",
        imageUrl:
          "https://via.placeholder.com/200x200/000080/FFFFFF?text=Champion+Jacket",
        price: 250000,
      },
      {
        id: "prod003",
        name: "Quần jogger Nike thể thao",
        size: "L",
        imageUrl:
          "https://via.placeholder.com/200x200/333333/FFFFFF?text=Nike+Jogger",
        price: 300000,
      },
    ];

    return MOCK_PRODUCTS.filter((product) => product.size === size);
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm theo size:", error);
    handleApiError(error, "Không thể lọc sản phẩm theo size.");
    throw error;
  }
};

// Mô phỏng API lọc sản phẩm theo giá
export const filterProductsByPrice = async (minPrice, maxPrice) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập độ trễ
    console.log(
      `Mock API: Đang lọc sản phẩm theo giá: từ ${minPrice} đến ${maxPrice}`
    );

    // --- MÔ PHỎNG API CALL ---
    // Trong thực tế, bạn sẽ làm như thế này (giả sử backend có endpoint này):
    // const response = await api.get(`/Products/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    // return response.data; // Trả về dữ liệu từ backend

    const MOCK_PRODUCTS = [
      {
        id: "prod001",
        name: "Áo thun Champion đen đỏ size L",
        price: 150000,
        imageUrl:
          "https://via.placeholder.com/200x200/000000/FF0000?text=Champion+TShirt",
      },
      {
        id: "prod002",
        name: "Jacket Champion - Hàng 2hand, legit",
        price: 250000,
        imageUrl:
          "https://via.placeholder.com/200x200/000080/FFFFFF?text=Champion+Jacket",
      },
      {
        id: "prod003",
        name: "Quần jogger Nike thể thao",
        price: 300000,
        imageUrl:
          "https://via.placeholder.com/200x200/333333/FFFFFF?text=Nike+Jogger",
      },
    ];

    return MOCK_PRODUCTS.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm theo giá:", error);
    handleApiError(error, "Không thể lọc sản phẩm theo giá.");
    throw error;
  }
};

// Mô phỏng API lọc sản phẩm theo kết hợp các bộ lọc
export const filterProducts = async (brand, size, minPrice, maxPrice) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập độ trễ
    console.log(`Mock API: Đang lọc sản phẩm với bộ lọc kết hợp`);

    // --- MÔ PHỎNG API CALL ---
    // Trong thực tế, bạn sẽ làm như thế này (giả sử backend có endpoint này):
    // const response = await api.get(`/Products/filter?brand=${brand}&size=${size}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    // return response.data; // Trả về dữ liệu từ backend

    const MOCK_PRODUCTS = [
      {
        id: "prod001",
        name: "Áo thun Champion đen đỏ size L",
        brand: "Champion",
        size: "L",
        price: 150000,
        imageUrl:
          "https://via.placeholder.com/200x200/000000/FF0000?text=Champion+TShirt",
      },
      {
        id: "prod002",
        name: "Jacket Champion - Hàng 2hand, legit",
        brand: "Champion",
        size: "M",
        price: 250000,
        imageUrl:
          "https://via.placeholder.com/200x200/000080/FFFFFF?text=Champion+Jacket",
      },
      {
        id: "prod003",
        name: "Quần jogger Nike thể thao",
        brand: "Nike",
        size: "L",
        price: 300000,
        imageUrl:
          "https://via.placeholder.com/200x200/333333/FFFFFF?text=Nike+Jogger",
      },
    ];

    return MOCK_PRODUCTS.filter(
      (product) =>
        (brand ? product.brand === brand : true) &&
        (size ? product.size === size : true) &&
        (minPrice && maxPrice
          ? product.price >= minPrice && product.price <= maxPrice
          : true)
    );
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm:", error);
    handleApiError(error, "Không thể lọc sản phẩm.");
    throw error;
  }
};

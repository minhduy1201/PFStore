// src/servers/ProfileService.js
import { api, handleApiError } from "./connection";
import { Alert } from "react-native";

export const fetchProfileData = async (userId) => {
  try {
    const response = await api.get(`/Profile/${userId}`);
    const realData = response.data?.data || response.data;
    console.log("Đã lấy dữ liệu hồ sơ từ server:", realData);

    const defaultAddress = realData.defaultAddress ?? {};

    return {
      fullName: realData.fullName ?? "",
      email: realData.email ?? "",
      soDienThoai: realData.phoneNumber ?? "",
      avatarUrl: realData.avatarUrl ?? "",
      gioiTinh: realData.gender ?? "",
      ngaySinh: realData.birthday ?? "",

      diaChi: {
        tenDuong: defaultAddress.houseNumberAndStreet ?? "",
        xa: defaultAddress.ward ?? "",
        huyen: defaultAddress.district ?? "",
        thanhPho: defaultAddress.city ?? "",
      },

      // Nếu bạn cần toàn bộ danh sách địa chỉ
      danhSachDiaChi: (realData.addresses ?? []).map((addr) => ({
        id: addr.addressId,
        tenDuong: addr.houseNumberAndStreet ?? "",
        xa: addr.ward ?? "",
        huyen: addr.district ?? "",
        thanhPho: addr.city ?? "",
        isDefault: addr.isDefault ?? false,
        fullDiaChi: addr.fullAddress ?? "",
      })),
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu hồ sơ từ server:", error);
    handleApiError(error, "Không thể tải dữ liệu hồ sơ từ máy chủ.");
    throw error;
  }
};
/**
 * Cập nhật thông tin cá nhân (họ tên, số điện thoại, giới tính, ngày sinh)
 * @param {number} userId - ID của người dùng
 * @param {{ fullName?: string, phoneNumber?: string, gender?: string, birthday?: string }} updateData - Dữ liệu cần cập nhật
 */
export const updateUserInfo = async (userId, updateData) => {
  try {
    const response = await api.put(`/Profile/${userId}/info`, updateData);

    // Kiểm tra phản hồi 204 (NoContent)
    if (response.status === 204) {
      Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật.");
    } else {
      Alert.alert("Cập nhật xong", "Thông tin đã được xử lý.");
    }

    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
    handleApiError(error, "Không thể cập nhật thông tin. Vui lòng thử lại.");
    return false;
  }
};

/**
 * Cập nhật avatar người dùng
 */
export const uploadUserAvatar = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("avatar", {
      uri: imageFile.uri,
      name: imageFile.name || "avatar.jpg",
      type: imageFile.type || "image/jpeg",
    });

    const response = await api.post(`/Profile/${userId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const avatarUrl = response.data.avatarUrl;
    Alert.alert("Thành công", "Avatar đã được cập nhật.");
    return avatarUrl;
  } catch (error) {
    console.error("Lỗi khi cập nhật avatar:", error);
    handleApiError(error, "Cập nhật avatar thất bại.");
    throw error;
  }
};

// export const updateProfileData = async (userId, profileData) => {
//   try {
//     const dataToSend = {
//       userId: userId,
//       fullName: profileData.fullName,
//       phoneNumber: profileData.soDienThoai,
//       email: profileData.email,
//       avatarUrl: profileData.avatarUrl,
//       gender: profileData.gioiTinh ?? null,
//       birthday: profileData.ngaySinh ?? null, // "YYYY-MM-DD"
//       addressLine: profileData.diaChi?.tenDuong ?? "",
//       city: profileData.diaChi?.thanhPho ?? ""
//     };

//     const response = await api.put(`/Profile/${userId}`, dataToSend);

//     return {
//       message: "Cập nhật hồ sơ thành công!",
//       status: response.status,
//     };
//   } catch (error) {
//     console.error("Lỗi khi cập nhật profile:", error);
//     handleApiError(error, "Cập nhật hồ sơ thất bại.");
//     throw error;
//   }
// };

// --- Dữ liệu giả lập cho Profile ---
// Tên các trường ở đây sẽ khớp với tên mà frontend mong muốn
// (Có thể khác với tên trường mà backend sẽ trả về,
// nếu có thì bạn cần ánh xạ lại trong hàm fetchProfileData)
// const MOCK_PROFILE_DATA = {
//   ho: "Thái",
//   ten: "Tường An",
//   email: "tuongan@gmail.com",
//   soDienThoai: "+(84) 012345678",
//   diaChi: {
//     // Cấu trúc lồng nhau như backend có thể trả về
//     quocGia: "Việt Nam",
//     tinhThanhPho: "Thủ Đức",
//     huyenXa: "Linh Trung",
//     tenDuongSoNha: "Mạc Đĩnh Chi",
//   },
//   avatarUrl:
//     "https://images.unsplash.com/photo-1535713875002-d1d0cf2637fd?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   mapImageUrl: "https://via.placeholder.com/350x150/e0e0e0/333333?text=MAP",
// };

// // Hàm lấy thông tin hồ sơ
// export const fetchProfileData = async () => {
//   try {
//     // --- MÔ PHỎNG API CALL ---
//     // Giả lập độ trễ mạng
//     await new Promise((resolve) => setTimeout(resolve, 1200)); // 1.2 giây
//     console.log("Mock API: Đang lấy dữ liệu hồ sơ...");

//     // Trong thực tế, bạn sẽ làm như thế này:
//     // const response = await api.get("/profile"); // Giả sử endpoint là /profile
//     // const realData = response.data.data; // Giả sử dữ liệu nằm trong response.data.data
//     // return {
//     //   ho: realData.lastName, // Ví dụ ánh xạ nếu backend dùng lastName
//     //   ten: realData.firstName,
//     //   email: realData.email,
//     //   soDienThoai: realData.phoneNumber,
//     //   diaChi: {
//     //     quocGia: realData.address.country,
//     //     tinhThanhPho: realData.address.province,
//     //     huyenXa: realData.address.district,
//     //     tenDuongSoNha: realData.address.streetAddress,
//     //   },
//     //   avatarUrl: realData.avatarUrl,
//     //   mapImageUrl: realData.mapImageUrl,
//     // };

//     return MOCK_PROFILE_DATA; // Trả về dữ liệu giả lập
//   } catch (error) {
//     console.error("Lỗi khi fetch profile data (mock):", error);
//     handleApiError(error, "Không thể tải dữ liệu hồ sơ."); // Sử dụng hàm xử lý lỗi chung
//     throw error; // Vẫn ném lỗi để component có thể bắt và cập nhật UI (error state)
//   }
// };

// // Hàm cập nhật thông tin hồ sơ
// export const updateProfileData = async (profileData) => {
//   try {
//     // --- MÔ PHỎNG API CALL ---
//     await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8 giây
//     console.log("Mock API: Đang cập nhật dữ liệu hồ sơ:", profileData);

//     // Trong thực tế, bạn sẽ làm như thế này:
//     // Ánh xạ lại tên trường nếu cần trước khi gửi lên backend
//     // const dataToSend = {
//     //   lastName: profileData.ho,
//     //   firstName: profileData.ten,
//     //   email: profileData.email,
//     //   phoneNumber: profileData.soDienThoai,
//     //   address: {
//     //     country: profileData.diaChi.quocGia,
//     //     province: profileData.diaChi.tinhThanhPho,
//     //     district: profileData.diaChi.huyenXa,
//     //     streetAddress: profileData.diaChi.tenDuongSoNha,
//     //   },
//     // };
//     // const response = await api.put("/profile", dataToSend); // Giả sử endpoint là /profile và phương thức PUT
//     // return response.data; // Trả về phản hồi từ backend

//     return {
//       message: "Hồ sơ đã được cập nhật thành công (Mock)!",
//       status: 200,
//     }; // Phản hồi giả lập
//   } catch (error) {
//     console.error("Lỗi khi cập nhật profile data (mock):", error);
//     handleApiError(error, "Cập nhật hồ sơ thất bại.");
//     throw error;
//   }
// };

// // Hàm đổi mật khẩu
// export const changeUserPassword = async (oldPassword, newPassword) => {
//   try {
//     // --- MÔ PHỎNG API CALL ---
//     await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8 giây
//     console.log("Mock API: Đang đổi mật khẩu:", { oldPassword, newPassword });

//     // Trong thực tế, bạn sẽ làm như thế này:
//     // const response = await api.post("/Auth/change-password", { oldPassword, newPassword });
//     // return response.data;

//     return { message: "Mật khẩu đã được đổi thành công (Mock)!", status: 200 }; // Phản hồi giả lập
//   } catch (error) {
//     console.error("Lỗi khi đổi mật khẩu (mock):", error);
//     handleApiError(error, "Đổi mật khẩu thất bại.");
//     throw error;
//   }
// };

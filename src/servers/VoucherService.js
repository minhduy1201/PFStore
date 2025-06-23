// VoucherService.js
import { api, handleApiError } from "./connection";

// 2. Lấy danh sách voucher áp dụng được cho người dùng theo giá trị đơn hàng
export const getAvailableVouchers = async (userId, orderTotal) => {
  try {
    const res = await api.get("Vouchers/available", {
      params: {
        userId,
        orderTotal,
      },
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 3. Kiểm tra mã voucher
export const checkVoucherByCode = async (code, orderTotal) => {
  try {
    const res = await api.get("Vouchers/check", {
      params: {
        code,
        orderTotal,
      },
    });
    return res.data; // Trả về voucher nếu đối chiếu hợp lệ
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// 4. (Tuỳ chọn) Giảm quantity của voucher sau khi đặt hàng - nếu server yêu cầu
export const decreaseVoucherQuantity = async (promotionId) => {
  try {
    const res = await api.put(`Vouchers/${promotionId}/decrease`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

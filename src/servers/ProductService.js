import { api, handleApiError } from "./connection";

export const GetCategories = async () => {
    try {
        const response = await api.get('/Categories');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Lỗi khi lấy danh sách danh mục');
        return null;
    }
}
export const GetProducts = async () => {
    try {
        const response = await api.get('/Products');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Lỗi khi lấy danh sách sản phẩm');
        return null;
    }
}
import { api, handleApiError } from "./connection";

//Lấy danh sách các danh mục
export const GetCategories = async () => {
    try {
        const response = await api.get('/Categories');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Lỗi khi lấy danh sách danh mục');
        return null;
    }
}

//Lấy danh sách các sản phẩm
export const getProducts = async () =>{
    try {
        const response = await api.get('/Products')
        return response.data
    } catch (error) {
        handleApiError(error, "Lỗi khi lấy danh sách sản phẩm")
        return null
    }
}
import axios from "axios";

// API mẫu: https://provinces.open-api.vn/api/
export const getProvinces = async () => {
  const res = await axios.get("https://provinces.open-api.vn/api/p/");
  return res.data; // [{code, name, ...}]
};

export const getDistricts = async (provinceCode) => {
  const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
  return res.data.districts; // [{code, name, ...}]
};

export const getWards = async (districtCode) => {
  const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
  return res.data.wards; // [{code, name, ...}]
};
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { GetCategories } from "../servers/ProductService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserAddresses } from "../servers/AddressService";
import { CreatePost } from "../servers/ProductService";

export const BRANDS = [
  { label: "Nike", value: "Nike" },
  { label: "Adidas", value: "Adidas" },
  { label: "Puma", value: "Puma" },
  { label: "Gucci", value: "Gucci" },
  { label: "Zara", value: "Zara" },
  { label: "H&M", value: "H&M" },
  { label: "Uniqlo", value: "Uniqlo" },
  { label: "Levi's", value: "Levi's" },
  { label: "Other", value: "Khác" },
];
const CONDITIONS = [
  { label: "Mới", value: "new" },
  { label: "Như mới", value: "like_new" },
  { label: "Đã qua sử dụng", value: "used" },
  { label: "Cũ", value: "old" },
  { label: "Hư hỏng", value: "broken" },
];


const CreatePostScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
const [openCondition, setOpenCondition] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [openSelects, setOpenSelects] = useState({});
  const [openBrand, setOpenBrand] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      const selectedCat = categories.find(
        (c) => c.categoryId === selectedCategoryId
      );
      if (selectedCat) {
        setAttributes(selectedCat.attributes || []);
        const defaults = {};
        (selectedCat.attributes || []).forEach((attr) => {
          defaults[attr.attributeId] = "";
        });
        setAttributeValues(defaults);
        setOpenSelects({});
      }
    }
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const result = await GetCategories();
      if (Array.isArray(result)) {
        setCategories(result);
      } else {
        throw new Error("Invalid category response");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải danh mục sản phẩm.");
    }
  };

  const fetchAddresses = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const res = await getUserAddresses(userId);
        setAddresses(res || []);
        const defaultAddr = res.find((addr) => addr.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.addressId);
      }
    } catch (err) {
      setAddresses([]);
    }
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Giới hạn ảnh", "Bạn chỉ có thể chọn tối đa 5 ảnh.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    // if (!title || !price || !selectedCategoryId) {
    //   Alert.alert(
    //     "Thiếu thông tin",
    //     "Vui lòng điền đầy đủ các trường bắt buộc."
    //   );
    //   return;
    // }

    try {
      const userId = await AsyncStorage.getItem("userId");

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("Price", parseFloat(price));
      formData.append("SalePrice", parseFloat(salePrice || 0));
      formData.append("Brand", brand);
      formData.append("Condition", condition);
      formData.append("CategoryId", selectedCategoryId);
      formData.append("SellerId", Number(userId));

      const selectedAddress = addresses.find(
        (addr) => addr.addressId === selectedAddressId
      );
      formData.append("Location", selectedAddress?.addressLine ?? "");

      const attributeList = Object.entries(attributeValues).map(
        ([key, value]) => ({
          attributeId: Number(key),
          value,
        })
      );
      formData.append("ProductAttributes", JSON.stringify(attributeList));

      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("Images", {
          uri,
          name: filename,
          type,
        });
      }

      await CreatePost(formData);
      Alert.alert("Thành công", "Sản phẩm đã được đăng!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể đăng sản phẩm. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Đăng sản phẩm</Text>

      <View style={styles.imageRow}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.imagePreview} />
        ))}
        {images.length < 5 && (
          <TouchableOpacity style={styles.imageAdd} onPress={pickImage}>
            <Entypo name="plus" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Danh mục</Text>
      <DropDownPicker
        open={openCategory}
        value={selectedCategoryId}
        items={categories.map((c) => ({ label: c.name, value: c.categoryId }))}
        setOpen={setOpenCategory}
        setValue={setSelectedCategoryId}
        setItems={() => {}}
        style={styles.input}
        placeholder="Chọn danh mục"
        listMode="MODAL"
        zIndex={2000}
      />

      {attributes.map((attr) => {
        const value = attributeValues[attr.attributeId] || "";

        if (attr.type === "select") {
          const options = JSON.parse(attr.optionsJson || "[]");
          return (
            <View key={attr.attributeId} style={styles.field}>
              <Text style={styles.label}>{attr.name}</Text>
              <DropDownPicker
                open={!!openSelects[attr.attributeId]}
                value={value}
                items={options.map((opt) => ({ label: opt, value: opt }))}
                setOpen={(open) =>
                  setOpenSelects((prev) => ({
                    ...Object.fromEntries(
                      Object.keys(prev).map((k) => [k, false])
                    ),
                    [attr.attributeId]: open,
                  }))
                }
                setValue={(val) =>
                  setAttributeValues((prev) => ({
                    ...prev,
                    [attr.attributeId]: val(),
                  }))
                }
                setItems={() => {}}
                placeholder={attr.description}
                style={styles.input}
                listMode="MODAL"
                zIndex={1000 - attr.attributeId}
              />
            </View>
          );
        } else {
          return (
            <View key={attr.attributeId} style={styles.field}>
              <Text style={styles.label}>{attr.name}</Text>
              <TextInput
                style={styles.input}
                value={value}
                keyboardType={attr.type === "number" ? "numeric" : "default"}
                placeholder={attr.description}
                onChangeText={(text) =>
                  setAttributeValues((prev) => ({
                    ...prev,
                    [attr.attributeId]: text,
                  }))
                }
              />
            </View>
          );
        }
      })}

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Giá sale</Text>
      <TextInput
        style={styles.input}
        value={salePrice}
        onChangeText={setSalePrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Thương hiệu</Text>
      <DropDownPicker
        open={openBrand}
        value={brand}
        items={BRANDS}
        setOpen={setOpenBrand}
        setValue={setBrand}
        setItems={() => {}}
        style={styles.input}
        placeholder="Chọn thương hiệu"
        listMode="MODAL"
        zIndex={900}
      />

      <Text style={styles.label}>Tình trạng</Text>
      <DropDownPicker
        open={openCondition}
        value={condition}
        items={CONDITIONS}
        setOpen={setOpenCondition}
        setValue={setCondition}
        setItems={() => {}}
        style={styles.input}
        placeholder="Chọn tình trạng"
        listMode="MODAL"
        zIndex={800}
      />

      <Text style={styles.label}>Mô tả chi tiết</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Chọn địa chỉ giao hàng</Text>
      {addresses.length === 0 ? (
        <Text style={{ color: "#888", marginBottom: 10 }}>
          Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ trong hồ sơ cá nhân.
        </Text>
      ) : (
        addresses.map((addr) => (
          <TouchableOpacity
            key={addr.addressId}
            style={[
              styles.addressItem,
              selectedAddressId === addr.addressId && styles.selectedAddress,
            ]}
            onPress={() => setSelectedAddressId(addr.addressId)}
          >
            <Text style={styles.addressText}>{addr.addressLine}</Text>
            {selectedAddressId === addr.addressId && (
              <Text style={styles.defaultLabel}>Đã chọn</Text>
            )}
          </TouchableOpacity>
        ))
      )}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  imageRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  imagePreview: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
  imageAdd: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontWeight: "600", marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  field: { marginBottom: 10 },
  rowAlign: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: { fontWeight: "bold" },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2C3E50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold" },
  addressItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedAddress: {
    borderColor: "#4472C4",
    borderWidth: 2,
    backgroundColor: "#e6f0ff",
  },
  addressText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  defaultLabel: {
    fontSize: 13,
    color: "#4472C4",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default CreatePostScreen;

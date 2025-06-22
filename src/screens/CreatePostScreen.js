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
  ActivityIndicator, // Đã xóa ActivityIndicator
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import {
  GetCategories,
  CreatePost,
  getProductById,
  updatePost,
} from "../servers/ProductService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserAddresses } from "../servers/AddressService";

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

const CreatePostScreen = ({ navigation, route }) => {
  const productId = route.params?.productId;
  // console.log("Id là", productId);

  // --- States cho Form ---
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [brand, setBrand] = useState(null);
  const [condition, setCondition] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [attributeValues, setAttributeValues] = useState({}); // Lưu trữ giá trị của các thuộc tính
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // --- States cho DropDownPickers ---
  const [openCondition, setOpenCondition] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openSelects, setOpenSelects] = useState({}); // Dành cho các DropDownPicker của attributes
  const [openBrand, setOpenBrand] = useState(false);

  // --- States cho Data và Submitting ---
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]); // Attributes của danh mục đã chọn
  const [addresses, setAddresses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái khi đang gửi form

  // --- Effect 1: Fetch Categories and Addresses (chỉ chạy 1 lần khi mount) ---
  useEffect(() => {
    async function fetchData() {
      await fetchCategories();
      await fetchAddresses();
    }
    fetchData();
  }, []);

  // --- Effect 2: Fetch Product Data (chỉ chạy khi productId có) ---
  useEffect(() => {
    const fetchProductDataForEdit = async () => {
      if (productId) {
        try {
          const product = await getProductById(productId);
          if (product) {
            setTitle(product.title || "");
            setPrice(product.price ? product.price.toString() : "");
            setSalePrice(product.salePrice ? product.salePrice.toString() : "");
            setBrand(product.brand || null);
            setCondition(product.condition || null);
            setDescription(product.description || "");
            setSelectedCategoryId(product.categoryId);
            setImages(product.images || []);

            const initialAttributeValues = (product.attributes || []).reduce(
              (acc, attr) => {
                if (attr.AttributeId) {
                  acc[attr.AttributeId] = attr.Value;
                }
                return acc;
              },
              {}
            );
            setAttributeValues(initialAttributeValues);

            if (product.location && addresses.length > 0) {
              const matchedAddress = addresses.find(
                (addr) => addr.addressLine === product.location
              );
              if (matchedAddress) {
                setSelectedAddressId(matchedAddress.addressId);
              }
            }
          }
        } catch (err) {
          Alert.alert(
            "Lỗi tải dữ liệu",
            "Không thể tải dữ liệu sản phẩm để chỉnh sửa."
          );
          console.error("Error loading product data:", err);
          navigation.goBack();
        }
      }
    };

    // Chỉ gọi khi có productId VÀ categories/addresses đã tải (để đảm bảo data liên quan sẵn sàng)
    if (productId && categories.length > 0 && addresses.length > 0) {
      fetchProductDataForEdit();
    }
  }, [productId, categories, addresses]); // Dependencies: productId, categories, addresses

  // --- Effect 3: Update attributes when category changes ---
  useEffect(() => {
    if (selectedCategoryId !== null && categories.length > 0) {
      const selectedCat = categories.find(
        (c) => c.categoryId === selectedCategoryId
      );
      if (selectedCat) {
        setAttributes(selectedCat.attributes || []);
        const defaults = {};
        (selectedCat.attributes || []).forEach((attr) => {
          defaults[attr.attributeId] = "";
        });

        // Nếu đang tạo mới, hoặc đang chỉnh sửa mà categoryId thay đổi, thì reset/merge attributes
        if (!productId) {
          setAttributeValues(defaults);
        } else {
          // Khi chỉnh sửa, merge các giá trị cũ với các giá trị mặc định mới
          setAttributeValues((prev) => ({ ...defaults, ...prev }));
        }

        setOpenSelects({});
      }
    }
  }, [selectedCategoryId, categories, productId]); // Dependency: selectedCategoryId, categories, productId

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
      console.error("Error fetching addresses:", err);
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
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
    });
    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newUris]);
    }
  };

  const removeImage = (index) => {
    Alert.alert("Xác nhận xóa", "Bạn có muốn xóa ảnh này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => {
          const newImages = [...images];
          newImages.splice(index, 1);
          setImages(newImages);
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!title || !price || !selectedCategoryId || images.length === 0) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ tiêu đề, giá, chọn danh mục và ít nhất một ảnh."
      );
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const userId = await AsyncStorage.getItem("userId");
      const currentPrice = parseFloat(price);
      const currentSalePrice = parseFloat(salePrice || 0);

      if (isNaN(currentPrice) || currentPrice <= 0) {
        Alert.alert("Lỗi", "Giá sản phẩm phải là số dương.");
        return;
      }
      if (isNaN(currentSalePrice) || currentSalePrice < 0) {
        Alert.alert("Lỗi", "Giá sale phải là số không âm.");
        return;
      }
      if (currentSalePrice > currentPrice) {
        Alert.alert("Lỗi", "Giá sale không thể lớn hơn giá gốc.");
        return;
      }

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("Price", currentPrice);
      formData.append("SalePrice", currentSalePrice);
      formData.append("Brand", brand || "");
      formData.append("Condition", condition || "");
      formData.append("CategoryId", selectedCategoryId);
      formData.append("SellerId", Number(userId));

      const selectedAddress = addresses.find(
        (addr) => addr.addressId === selectedAddressId
      );
      formData.append("Location", selectedAddress?.addressLine ?? "");

      const attributeList = Object.entries(attributeValues).map(
        ([key, value]) => ({
          attributeId: Number(key),
          value: String(value),
        })
      );

      if (productId) {
        // Chế độ chỉnh sửa
        const payload = {
          productId: productId,
          title: title,
          description: description,
          price: currentPrice,
          salePrice: currentSalePrice,
          brand: brand,
          condition: condition,
          categoryId: selectedCategoryId,
          location: selectedAddress?.addressLine ?? "",
          productAttributes: attributeList,
        };

        const response = await updatePost(productId, payload);
        Alert.alert("Thành công", response.message);
        navigation.goBack();
      } else {
        // Chế độ tạo mới
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
        formData.append("ProductAttributes", JSON.stringify(attributeList));

        await CreatePost(formData);
        Alert.alert("Thành công", "Sản phẩm đã được đăng!");
        navigation.goBack();
      }
    } catch (err) {
      console.error("Lỗi khi xử lý bài đăng:", err);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xử lý sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Không có phần loading overlay nữa

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        {productId ? "Chỉnh sửa sản phẩm" : "Đăng sản phẩm mới"}
      </Text>

      <Text style={styles.label}>Ảnh sản phẩm (tối đa 5 ảnh)</Text>
      <View style={styles.imageRow}>
        {images.map((uri, idx) => (
          <TouchableOpacity key={idx} onPress={() => removeImage(idx)}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <View style={styles.removeImageIcon}>
              <Entypo name="circle-with-cross" size={18} color="red" />
            </View>
          </TouchableOpacity>
        ))}
        {images.length < 5 && (
          <TouchableOpacity style={styles.imageAdd} onPress={pickImage}>
            <Entypo name="plus" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>
        Tiêu đề <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề sản phẩm"
      />

      <Text style={styles.label}>
        Danh mục <Text style={styles.required}>*</Text>
      </Text>
      <DropDownPicker
        open={openCategory}
        value={selectedCategoryId}
        items={categories.map((c) => ({ label: c.name, value: c.categoryId }))}
        setOpen={setOpenCategory}
        setValue={setSelectedCategoryId}
        setItems={setCategories}
        style={styles.input}
        placeholder="Chọn danh mục"
        listMode="MODAL"
        zIndex={3000}
        dropDownContainerStyle={styles.dropdownContainer}
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
                placeholder={attr.description || `Chọn ${attr.name}`}
                style={styles.input}
                listMode="MODAL"
                zIndex={2000 - attr.attributeId}
                dropDownContainerStyle={styles.dropdownContainer}
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
                placeholder={attr.description || `Nhập ${attr.name}`}
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

      <Text style={styles.label}>
        Giá <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Nhập giá (ví dụ: 100000)"
      />

      <Text style={styles.label}>Giá sale (không bắt buộc)</Text>
      <TextInput
        style={styles.input}
        value={salePrice}
        onChangeText={setSalePrice}
        keyboardType="numeric"
        placeholder="Nhập giá sale nếu có (ví dụ: 80000)"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Có thể thương lượng</Text>
        <Switch
          onValueChange={setIsNegotiable}
          value={isNegotiable}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isNegotiable ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <Text style={styles.label}>Thương hiệu</Text>
      <DropDownPicker
        open={openBrand}
        value={brand}
        items={BRANDS}
        setOpen={setOpenBrand}
        setValue={setBrand}
        setItems={BRANDS}
        style={styles.input}
        placeholder="Chọn thương hiệu"
        listMode="MODAL"
        zIndex={900}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.label}>Tình trạng</Text>
      <DropDownPicker
        open={openCondition}
        value={condition}
        items={CONDITIONS}
        setOpen={setOpenCondition}
        setValue={setCondition}
        setItems={CONDITIONS}
        style={styles.input}
        placeholder="Chọn tình trạng"
        listMode="MODAL"
        zIndex={800}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.label}>Mô tả chi tiết</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả chi tiết sản phẩm của bạn..."
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
          disabled={isSubmitting}
        >
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            // ActivityIndicator chỉ hiển thị khi đang gửi form
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {productId ? "Cập nhật" : "Đăng"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  imagePreview: { width: 70, height: 70, borderRadius: 8, resizeMode: "cover" },
  imageAdd: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  removeImageIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  label: {
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 4,
    fontSize: 16,
    color: "#555",
  },
  required: {
    color: "red",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  field: { marginBottom: 10 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: { fontWeight: "bold", fontSize: 16, color: "#333" },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2C3E50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  addressItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  // loadingOverlay: { // Đã xóa kiểu này
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(255,255,255,0.8)",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   zIndex: 9999,
  // },
  dropdownContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
});

export default CreatePostScreen;

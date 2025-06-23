import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { deleteCart, getCartByUserID } from "../servers/CartService";

// Helper function to format a raw CartItemDto from backend into frontend CartItem state

const formatBackendCartItemToFrontend = (backendItem) => {
  // Lấy URL của hình ảnh đầu tiên trong mảng productImages

  const imageUrl =
    backendItem.product &&
    backendItem.product.productImages &&
    backendItem.product.productImages.length > 0
      ? backendItem.product.productImages[0].imageUrl
      : "https://via.placeholder.com/150"; 

  return {
    id: backendItem.cartId,

    productId: backendItem.product ? backendItem.product.productId : null,

    name: backendItem.product ? backendItem.product.title : "Sản phẩm không rõ",

    price: backendItem.product ? backendItem.product.price : 0,

    quantity: backendItem.quantity,

    image: imageUrl,

    color: "N/A",

    size: "N/A",

    sellerId: backendItem.product ? backendItem.product.sellerId : null,

    isSelected: true, //mặc định là sản phẩm chưa được chọn
  };
};

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [isAddressModalVisible, setAddressModalVisible] = useState(false);

  const [street, setStreet] = useState("26, Đường Số 2, P. Thảo Điền");

  const [ward, setWard] = useState("An Phú");

  const [district, setDistrict] = useState("Quận 2");

  const [city, setCity] = useState("TP.HCM"); // Hàm để format tiền tệ Việt Nam

  const formatCurrency = (amount) => {
    // Đảm bảo amount là một số hợp lệ trước khi format

    if (typeof amount !== "number" || isNaN(amount)) {
      return "0đ"; // Hoặc một giá trị mặc định khác
    }

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",

      currency: "VND",

      minimumFractionDigits: 0,

      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchCartItems = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const data = await getCartByUserID(); // data là một mảng các CartItemDto

      const formattedCartItems = data.map((item) =>
        formatBackendCartItemToFrontend(item)
      );

      setCartItems(formattedCartItems);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);

      setError("Không thể tải giỏ hàng. Vui lòng thử lại.");

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchCartItems();
    });

    return unsubscribe;
  }, [fetchCartItems, navigation]); // Xử lý khi nhấn vào checkbox của sản phẩm

  const toggleItemSelection = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartId ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  }; // Tính tổng tiền chỉ cho các sản phẩm đã được chọn

  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.isSelected ? item.price * item.quantity : 0),

    0
  ); //Xử lý phần bấm vào Thanh toán

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter((item) => item.isSelected);

    if (selectedProducts.length == 0) {
      Alert.alert("Thanh toán", "Hãy chọn sản phẩm để thanh toán");
    } else {
      navigation.navigate("Checkout", { selectedProducts: selectedProducts });
    }
  }; // Xử lý xóa sản phẩm

  const removeItem = async (cartId) => {
    Alert.alert(
      "Xác nhận xóa",

      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",

      [
        { text: "Hủy", style: "cancel" },

        {
          text: "Xóa",

          onPress: async () => {
            try {
              await deleteCart(cartId);

              setCartItems(cartItems.filter((item) => item.id !== cartId));
            } catch (error) {
              console.error("Lỗi khi xóa sản phẩm:", error);

              Alert.alert(
                "Lỗi",

                error.message || "Không thể xóa sản phẩm. Vui lòng thử lại."
              );
            }
          },
        },
      ]
    );
  };

  const handleSaveAddress = () => {
    console.log("Saving address:", { street, ward, district, city });

    Alert.alert(
      "Thông báo",

      "Địa chỉ đã được lưu thành công (chức năng lưu API chưa tích hợp)."
    );

    setAddressModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#323660" />
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCartItems}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{cartItems.length}</Text>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mainContentArea}>
        <ScrollView style={styles.content}>
          {/* Danh sách sản phẩm trong giỏ */}
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <View style={styles.emptyCartIconContainer}>
                <Ionicons name="bag-handle" size={70} color="#323660" />
                <Text style={styles.emptyCartIconText}>S</Text>
              </View>
              <Text style={styles.emptyCartText}>
                Giỏ hàng của bạn đang trống
              </Text>
            </View>
          ) : (
            cartItems.map((item, index) => (
              <View key={index} style={styles.cartItem}>
                <TouchableOpacity
                  style={styles.itemContent} // Thêm style này để căn chỉnh nội dung sản phẩm
                  onPress={() =>
                    navigation.navigate("ProductDetail", {
                      productId: item.productId,
                    })
                  }
                >
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    <TouchableOpacity
                      style={styles.removeButtonOverlay}
                      onPress={() => removeItem(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text
                      style={styles.itemColorSize}
                    >{`${item.color}, Size ${item.size}`}</Text>
                    <View style={styles.quantityPriceContainer}>
                      <Text style={styles.itemPrice}>
                        {formatCurrency(item.price * item.quantity)}
                      </Text>
                    </View>
                  </View>
                  {/* Checkbox bên trái */}
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleItemSelection(item.id)}
                  >
                    <Ionicons
                      name={
                        item.isSelected ? "checkbox-outline" : "square-outline"
                      }
                      size={24}
                      color="#323660"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        {/* Tổng tiền và nút thanh toán (Cố định ở dưới) */}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <View style={styles.totalTextAmountContainer}>
              <Text style={styles.totalText}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Phần chỉnh sửa thông tin */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Địa chỉ giao hàng</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Ionicons name="arrow-forward" size={24} color="#323660" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Tên đường/số nhà</Text>
              <TextInput
                style={styles.input}
                value={street}
                onChangeText={setStreet}
              />
              <Text style={styles.label}>Xã/phường/thị trấn</Text>
              <TextInput
                style={styles.input}
                value={ward}
                onChangeText={setWard}
              />
              <Text style={styles.label}>Quận/Huyện</Text>
              <TextInput
                style={styles.input}
                value={district}
                onChangeText={setDistrict}
              />
              <Text style={styles.label}>Thành phố, tỉnh</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddress}
              >
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginRight: 8 },
  itemCountBadge: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  itemCountText: { fontSize: 12, color: "#333", fontWeight: "bold" },
  mainContentArea: { flex: 1 },
  content: { flexGrow: 1, padding: 16, paddingBottom: 150 },
  cartItem: {
    flexDirection: "row", // Đảm bảo flex row để checkbox và nội dung cạnh nhau
    alignItems: "center", // Căn giữa theo chiều dọc
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 10, // Khoảng cách giữa checkbox và ảnh sản phẩm
    padding: 5, // Tăng diện tích chạm cho checkbox
    justifyContent: "center",
  },
  itemContent: {
    flexDirection: "row",
    flex: 1, // Để nội dung sản phẩm chiếm hết phần còn lại
  },
  itemImageContainer: { position: "relative" },
  itemImage: { width: 100, height: 100, borderRadius: 8 },
  removeButtonOverlay: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 4,
  },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  itemName: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  itemColorSize: { fontSize: 14, color: "#666", marginBottom: 8 },
  quantityPriceContainer: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemPrice: { fontSize: 16, color: "#e91e63", fontWeight: "bold" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityButton: {},
  quantity: { marginHorizontal: 8, fontSize: 16, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Giúp đẩy totalContainer sang trái và checkoutButton sang phải
    // Bỏ flex: 1 ở đây vì footer là container chính
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Cái này sẽ giúp totalContainer chiếm hết không gian còn lại bên trái
    marginRight: 15, // Khoảng cách giữa phần tổng cộng và nút Checkout
  },
  totalTextAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    // Bạn có thể không cần paddingRight ở đây nếu muốn gọn hơn
  },
  totalText: { fontSize: 18, fontWeight: "500", marginRight: 8 },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#e91e63" },
  checkoutButton: {
    backgroundColor: "#323660",
    // Loại bỏ flex: 1 ở đây!
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24, // Giữ padding này để nút có độ rộng tự nhiên theo nội dung
    width: 150, // **Thêm thuộc tính width cố định để nút không thay đổi kích thước**
    // Hoặc dùng minWidth nếu bạn muốn nó co giãn một chút nhưng có giới hạn:
    // minWidth: 120,
  },
  checkoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyCartIconContainer: {
    marginBottom: 16,
    position: "relative",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  emptyCartText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  emptyCartIconText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -10 }],
    fontSize: 45,
    fontWeight: "bold",
    color: "#323660",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addressTitle: { fontSize: 18, fontWeight: "bold", marginRight: 16 },
  addressContent: { flex: 1 },
  addressText: { fontSize: 16, color: "#666" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalContent: {},
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#323660",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#333" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#323660",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  retryButtonText: { color: "#fff", fontSize: 16 },
});

export default CartScreen;

import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserAddresses } from "../servers/AddressService";
import { getUserId } from "../servers/AuthenticationService";
import { createOrder } from "../servers/OrderService";
import { deleteMultipleCartItems } from "../servers/CartService";

const CheckoutScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [selectedDisplayAddress, setSelectedDisplayAddress] = useState(null);
  const [allUserAddresses, setAllUserAddresses] = useState([]);
  const [isSelectAddressModalVisible, setSelectAddressModalVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAddresses = async () => {
        const userId = await getUserId();
        const addresses = await getUserAddresses(userId);
        setAllUserAddresses(addresses);

        if (addresses.length > 0) {
          const defaultAddress = addresses.find((addr) => addr.isDefault);
          if (defaultAddress) {
            setSelectedDisplayAddress(defaultAddress);
          } else {
            setSelectedDisplayAddress(addresses[0]);
          }
        } else {
          setSelectedDisplayAddress(null);
        }
      };

      fetchAddresses();
    }, [])
  );

  useEffect(() => {
    if (route.params?.selectedProducts) {
      setProducts(route.params.selectedProducts);
    }
  }, [route.params?.selectedProducts]);

  const subtotal = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' hoặc 'card'

  const discountAmount = appliedVoucher ? subtotal * 0.05 : 0;
  const totalAmount = subtotal - discountAmount;

  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(1);
  
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const vouchers = [
    {
      id: 1,
      name: "Đơn hàng đầu tiên",
      description: "Giảm 5% cho đơn hàng đầu tiên của bạn",
      expiryDate: "5.16.20",
      icon: "bag-handle-outline",
    },
    {
      id: 2,
      name: "Ưu đãi Giáng sinh",
      description: "Giảm 15% cho đơn hàng trên 1 triệu",
      expiryDate: "5.16.20",
      icon: "gift-outline",
    },
  ];

  const mockPaymentMethods = [
    {
      id: 1,
      brand: "mastercard",
      last4: "1579",
      expiry: "12/22",
      cardholder: "AMANDA MORGAN",
    },
    {
      id: 2,
      brand: "visa",
      last4: "5678",
      expiry: "11/24",
      cardholder: "AMANDA MORGAN",
    },
  ];

  const handleApplyVoucher = (voucher) => {
    console.log("Applying voucher:", voucher);
    setAppliedVoucher(voucher);
    setVoucherModalVisible(false);
  };

  const handleRemoveVoucher = () => {
    console.log("Removing voucher:", appliedVoucher);
    setAppliedVoucher(null);
  };
  
  const handleSelectPaymentMethod = (id) => {
    setSelectedPaymentMethodId(id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedDisplayAddress) {
      Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    if (products.length === 0) {
      Alert.alert("Lỗi", "Không có sản phẩm nào để đặt hàng.");
      return;
    }

    const buyerId = await getUserId();
    if (!buyerId) {
      Alert.alert("Lỗi", "Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
      navigation.replace("Login");
      return;
    }

    let sellerId = null;
    if (products.length > 0) {
      sellerId = products[0].sellerId;
    }
    
    if (!sellerId) {
      Alert.alert("Lỗi", "Không thể xác định người bán. Vui lòng thử lại.");
      return;
    }

    const invalidProducts = products.filter(item => !item.productId || !item.quantity || item.quantity <= 0);
    if (invalidProducts.length > 0) {
      Alert.alert("Lỗi", "Dữ liệu sản phẩm không hợp lệ. Vui lòng thử lại.");
      return;
    }

    const orderData = {
      buyerId: parseInt(buyerId),
      sellerId: parseInt(sellerId),
      addressId: selectedDisplayAddress.addressId,
      discountAmount: discountAmount,
      paymentMethod: paymentMethod,
      orderDetails: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        snapshotPrice: item.price,
      })),
    };

    console.log("Sending order data:", orderData);
    setIsPlacingOrder(true);
    try {
      const result = await createOrder(orderData);
      if (result) {
        // Chỉ xóa cart items nếu không phải là mua ngay
        const isBuyNow = route.params?.isBuyNow;
        if (!isBuyNow) {
          const purchasedCartIds = products.map(p => p.id);
          await deleteMultipleCartItems(purchasedCartIds);
        }

        Alert.alert(
          "Thành công", 
          `Đơn hàng của bạn đã được tạo thành công!\nMã đơn hàng: ${result.orderId}`, 
          [
            {
              text: "Xem đơn hàng",
              onPress: () => navigation.navigate("OrderDetails", { orderId: result.orderId }),
            },
            {
              text: "Về trang chủ",
              onPress: () => navigation.popToTop(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin người mua</Text>
            {allUserAddresses.length > 0 ? (
              <TouchableOpacity
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text style={styles.changeAddressButtonText}>Thay đổi</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text style={styles.addAddressButtonText}>
                  Cập nhật thêm địa chỉ
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.sectionContent}>
            {selectedDisplayAddress ? (
              <>
                <Text style={styles.infoText}>
                  {selectedDisplayAddress.fullName} -{" "}
                  {selectedDisplayAddress.phoneNumber}
                </Text>
                <Text style={styles.infoText}>
                  {selectedDisplayAddress.addressLine}, {" "}
                  {selectedDisplayAddress.city}
                </Text>
              </>
            ) : (
              <Text style={styles.infoText}>
                Chưa có địa chỉ nào được chọn.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText}>{products.length}</Text>
            </View>
            {appliedVoucher ? (
              <View style={styles.appliedVoucherChip}>
                <Text style={styles.appliedVoucherText}>5% Discount</Text>
                <TouchableOpacity onPress={handleRemoveVoucher}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color="#fff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addVoucherButton}
                onPress={() => setVoucherModalVisible(true)}
              >
                <Text style={styles.addVoucherButtonText}>Thêm Voucher</Text>
              </TouchableOpacity>
            )}
          </View>

          {products.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.title || item.name}</Text>
                <Text style={styles.productPrice}>
                  {item.price.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity 
              style={[styles.paymentMethodButton, paymentMethod === 'cod' && styles.paymentMethodButtonSelected]}
              onPress={() => setPaymentMethod('cod')}
            >
              <Text style={[styles.paymentMethodButtonText, paymentMethod === 'cod' && styles.paymentMethodButtonTextSelected]}>COD</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.paymentMethodButton, paymentMethod === 'card' && styles.paymentMethodButtonSelected]}
              onPress={() => {
                setPaymentMethod('card');
                setPaymentModalVisible(true);
              }}
            >
              <Text style={[styles.paymentMethodButtonText, paymentMethod === 'card' && styles.paymentMethodButtonTextSelected]}>Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          {appliedVoucher && (
             <Text style={styles.discountText}>Giảm giá: -{discountAmount.toLocaleString("vi-VN")}đ</Text>
          )}
          <View style={styles.totalContainer}>
             <Text style={styles.totalText}>Tổng cộng:</Text>
             <Text style={styles.totalAmount}>
                {totalAmount.toLocaleString("vi-VN")}đ
             </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, isPlacingOrder && styles.checkoutButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <Text style={styles.checkoutButtonText}>Đang xử lý...</Text>
          ) : (
            <Text style={styles.checkoutButtonText}>Đặt hàng</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVoucherModalVisible}
        onRequestClose={() => setVoucherModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vouchers</Text>
              <TouchableOpacity onPress={() => setVoucherModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {vouchers.map((voucher) => (
                <View key={voucher.id} style={styles.voucherItem}>
                  <View style={styles.voucherLeft}>
                    <View style={styles.voucherClip}></View>
                    <Ionicons name={voucher.icon} size={30} color="#323660" />
                  </View>
                  <View style={styles.voucherCenter}>
                    <Text style={styles.voucherName}>{voucher.name}</Text>
                    <Text style={styles.voucherDescription}>
                      {voucher.description}
                    </Text>
                  </View>
                  <View style={styles.voucherRight}>
                    <Text style={styles.voucherExpiry}>
                      Áp dụng đến {voucher.expiryDate}
                    </Text>
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={() => handleApplyVoucher(voucher)}
                    >
                      <Text style={styles.applyButtonText}>Thêm</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.voucherRightClip}></View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phương thức thanh toán</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Ionicons name="arrow-forward" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalContentHorizontal}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {mockPaymentMethods.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={styles.paymentCard}
                  onPress={() => handleSelectPaymentMethod(card.id)}
                >
                  <View style={styles.cardBrandIconContainer}>
                    <Text style={styles.cardBrandText}>
                      {card.brand === "mastercard" ? "MC" : "Visa"}
                    </Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardNumber}>
                      **** **** **** {card.last4}
                    </Text>
                    <Text style={styles.cardholderName}>{card.cardholder}</Text>
                  </View>
                  <View style={styles.cardRightInfo}>
                    {selectedPaymentMethodId === card.id ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#323660"
                      />
                    ) : (
                      <TouchableOpacity style={styles.cardSettingsIcon}>
                        <Ionicons
                          name="settings-outline"
                          size={20}
                          color="#323660"
                        />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.cardExpiry}>{card.expiry}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addPaymentMethodCard}
                onPress={() => {
                  console.log("Add new payment method");
                }}
              >
                <Ionicons name="add" size={30} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionContent: {},
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  addVoucherButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: "auto",
  },
  addVoucherButtonText: {
    fontSize: 14,
    color: "#555",
  },
  itemCountBadge: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  itemCountText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e91e63",
    marginTop: 4,
  },
  quantityContainer: {
    marginLeft: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  paymentMethodButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#f8f8f8'
  },
  paymentMethodButtonSelected: {
    backgroundColor: '#323660',
    borderColor: '#323660',
  },
  paymentMethodButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: '500'
  },
  paymentMethodButtonTextSelected: {
    color: '#fff',
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    paddingBottom: 50,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountText: {
    fontSize: 14,
    color: 'green',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "500",
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e91e63",
  },
  checkoutButton: {
    backgroundColor: "#323660",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#ccc",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContent: {
    paddingVertical: 10,
  },
  appliedVoucherChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323660",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: "auto",
  },
  appliedVoucherText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 4,
  },
  voucherItem: {
    flexDirection: "row",
    backgroundColor: "#e0eaff",
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#c6d9ff",
    borderStyle: "dashed",
    position: "relative",
    overflow: "hidden",
  },
  voucherLeft: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  voucherCenter: {
    flex: 1,
    justifyContent: "center",
  },
  voucherRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10,
  },
  voucherName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#323660",
    marginBottom: 4,
  },
  voucherDescription: {
    fontSize: 13,
    color: "#555",
  },
  voucherExpiry: {
    fontSize: 11,
    color: "#777",
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: "#323660",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  voucherClip: {
    position: "absolute",
    left: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f8f8",
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  voucherRightClip: {
    position: "absolute",
    right: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f8f8",
    top: "50%",
    transform: [{ translateY: -15 }],
  },
  modalContentHorizontal: {
    paddingHorizontal: 10,
  },
  paymentCard: {
    flexDirection: "row",
    backgroundColor: "#e0eaff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 12,
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardBrandIconContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBrandText: {
    fontSize: 12,
    color: "#333",
  },
  cardDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardholderName: {
    fontSize: 14,
    color: "#555",
  },
  cardRightInfo: {
    alignItems: "flex-end",
  },
  cardSettingsIcon: {
    marginBottom: 8,
  },
  cardExpiry: {
    fontSize: 14,
    color: "#555",
  },
  addPaymentMethodCard: {
    backgroundColor: "#323660",
    borderRadius: 8,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});

export default CheckoutScreen;
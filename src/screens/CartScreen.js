import React, { useState } from 'react';
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
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  // Mock data cho giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Jacket Champion - Hàng 2hand, legit',
      price: 250000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      color: 'Pink',
      size: 'M',
    },
    {
      id: 2,
      name: 'Kính mát Chanel nữ authentic',
      price: 170000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      color: 'Pink',
      size: 'M',
    },
  ]);

  // Mock data cho danh sách yêu thích
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 3,
      name: 'Áo thun Champion đen đỏ size L',
      price: 150000,
      image: 'https://via.placeholder.com/150',
      color: 'Pink',
      size: 'M',
    },
    {
      id: 4,
      name: 'Túi thời trang cao cấp',
      price: 170000,
      image: 'https://via.placeholder.com/150',
      color: 'Pink',
      size: 'M',
    },
  ]);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Xử lý tăng số lượng
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Xử lý giảm số lượng
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Xử lý xóa sản phẩm
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Xử lý thêm từ wishlist vào giỏ hàng (placeholder)
  const addItemFromWishlist = (item) => {
    // Implement logic to add item to cart
    Alert.alert('Thêm vào giỏ', `Thêm "${item.name}" vào giỏ hàng`);
  };

  // State và hàm cho modal chỉnh sửa địa chỉ
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [street, setStreet] = useState('26, Đường Số 2, P. Thảo Điền'); // Mock data
  const [ward, setWard] = useState('An Phú'); // Mock data
  const [district, setDistrict] = useState('Quận 2'); // Mock data
  const [city, setCity] = useState('TP.HCM'); // Mock data

  const handleSaveAddress = () => {
    // Logic để lưu địa chỉ (cập nhật state hoặc gọi API)
    console.log('Saving address:', { street, ward, district, city });
    // Đóng modal
    setAddressModalVisible(false);
  };

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

      {/* Delivery Address Section */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Địa chỉ giao hàng</Text>
        <View style={styles.addressContent}>
          <Text style={styles.addressText}>{`${street}, ${ward}, ${district},`}</Text>
          <Text style={styles.addressText}>{city}</Text>
        </View>
        <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
          <Ionicons name="pencil" size={20} color="#323660" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContentArea}>
        <ScrollView style={styles.content}>
          {/* Danh sách sản phẩm trong giỏ */}
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <View style={styles.emptyCartIconContainer}>
                {/* Placeholder for Shopping Bag Icon */}
                <Ionicons name="bag-handle" size={70} color="#323660" />
                 {/* Placeholder for the "S" inside the bag if needed */}
                 {/* You might need a custom icon or font for the S */}
                 <Text style={styles.emptyCartIconText}>S</Text>
              </View>
              <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống</Text>
              {/* Optional: Add a button to navigate to shopping */}
              {/* <TouchableOpacity style={styles.shopNowButton}>\n
                <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>\n
              </TouchableOpacity> */}
            </View>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <TouchableOpacity
                    style={styles.removeButtonOverlay}
                    onPress={() => removeItem(item.id)}
                  >
                     <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemColorSize}>{`${item.color}, Size ${item.size}`}</Text>

                  <View style={styles.quantityPriceContainer}>
                     <Text style={styles.itemPrice}>
                       {item.price.toLocaleString('vi-VN')}đ
                     </Text>
                     <View style={styles.quantityContainer}>
                       <TouchableOpacity
                         style={styles.quantityButton}
                         onPress={() => decreaseQuantity(item.id)}
                       >
                         <Ionicons name="remove-circle-outline" size={24} color="#777" />
                       </TouchableOpacity>
                       <Text style={styles.quantity}>{item.quantity}</Text>
                       <TouchableOpacity
                         style={styles.quantityButton}
                         onPress={() => increaseQuantity(item.id)}
                       >
                         <Ionicons name="add-circle-outline" size={24} color="#777" />
                       </TouchableOpacity>
                     </View>
                   </View>
                </View>
              </View>
            ))
          )}

          {/* Tiêu đề cho danh sách yêu thích */}
          <Text style={styles.wishlistTitle}>Từ danh sách yêu thích</Text>

          {/* Danh sách sản phẩm từ yêu thích */}
          {wishlistItems.map((item) => (
            <View key={item.id} style={styles.wishlistItem}>
               <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <TouchableOpacity
                  style={styles.removeButtonOverlay}
                  onPress={() => {
                     // Implement remove from wishlist logic
                     Alert.alert('Xóa khỏi yêu thích', `Xóa "${item.name}" khỏi danh sách yêu thích`);
                  }}
                >
                   <Ionicons name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  {item.price.toLocaleString('vi-VN')}đ
                </Text>
                <View style={styles.sizeButtonsContainer}>
                   <TouchableOpacity style={styles.sizeButton}>
                     <Text style={styles.sizeButtonText}>{item.color}</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.sizeButton}>
                     <Text style={styles.sizeButtonText}>{item.size}</Text>
                   </TouchableOpacity>
                   <TouchableOpacity 
                      style={styles.addToCartButton}
                      onPress={() => addItemFromWishlist(item)}
                    >
                      <Ionicons name="bag-add-outline" size={24} color="#323660" />
                   </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Mã giảm giá */}
          {/* <View style={styles.discountContainer}>
            <TextInput
              style={styles.discountInput}
              placeholder="Nhập mã giảm giá"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View> */}

        </ScrollView>

         {/* Tổng tiền và nút thanh toán (Cố định ở dưới) */}
         <View style={styles.footer}>
           <View style={styles.totalContainer}>
             <View style={styles.totalTextAmountContainer}>
                <Text style={styles.totalText}>Tổng cộng:</Text>
                <Text style={styles.totalAmount}>
                  {totalAmount.toLocaleString('vi-VN')}đ
                </Text>
             </View>
             <TouchableOpacity
               style={styles.checkoutButton}
               onPress={() => navigation.navigate('Checkout')}
             >
               <Text style={styles.checkoutButtonText}>Thanh toán</Text>
             </TouchableOpacity>
           </View>
         </View>
      </View>

      {/* Address Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Địa chỉ giao hàng</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                 <Ionicons name="arrow-forward" size={24} color="#323660" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.modalContent}>
                {/* Street Input (Tên đường/số nhà)*/}
                <Text style={styles.label}>Tên đường/số nhà</Text>
                <TextInput
                  style={styles.input}
                  value={street}
                  onChangeText={setStreet}
                />

                {/* Ward Input (Xã/phường/thị trấn)*/}
                {/* Ideally this would be a dropdown */}
                <Text style={styles.label}>Xã/phường/thị trấn</Text>
                <TextInput
                  style={styles.input}
                  value={ward}
                  onChangeText={setWard}
                />

                {/* District Input (Quận/Huyện)*/}
                {/* Ideally this would be a dropdown */}
                <Text style={styles.label}>Quận/Huyện</Text>
                <TextInput
                  style={styles.input}
                  value={district}
                  onChangeText={setDistrict}
                />

                {/* City Input (Thành phố, tỉnh)*/}
                {/* Ideally this would be a dropdown */}
                <Text style={styles.label}>Thành phố, tỉnh</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
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
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
   itemCountBadge: {
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
   },
   itemCountText: {
       fontSize: 12,
       color: '#333',
       fontWeight: 'bold',
   },
   mainContentArea: {
       flex: 1,
   },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 150,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
     shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
   wishlistItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImageContainer:{
     position: 'relative',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
   removeButtonOverlay: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 15,
      padding: 4,
   },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemColorSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
   quantityPriceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
   },
  itemPrice: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
   // style if needed
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
     fontWeight: 'bold',
  },

  wishlistTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 12,
  },
   sizeButtonsContainer:{
       flexDirection: 'row',
       alignItems: 'center',
       marginTop: 8,
   },
   sizeButton:{
       backgroundColor: '#e0e0e0',
       borderRadius: 4,
       paddingHorizontal: 8,
       paddingVertical: 4,
       marginRight: 8,
   },
   sizeButtonText:{
       fontSize: 14,
       color: '#333',
   },
    addToCartButton:{
        marginLeft: 'auto',
        padding: 4,
    },

  discountContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  discountInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  footer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
     shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  totalTextAmountContainer: {
      paddingRight: 20,
      flexDirection: 'row',
      alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  checkoutButton: {
    backgroundColor: '#323660',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartIconContainer: {
    marginBottom: 16,
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyCartIconText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -10 }],
    fontSize: 45,
    fontWeight: 'bold',
    color: '#323660',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 16,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
  },

  // Modal Styles (add these new styles)
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'flex-end', // Align to the bottom
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%', // Adjust height as needed
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    // Styles for content within modal
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#323660',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen; 
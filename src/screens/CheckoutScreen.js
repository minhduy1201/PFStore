import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = ({ navigation }) => {
  // Mock data (should ideally come from navigation params or state management)
  const products = [
    {
      id: 1,
      name: 'Jacket Champion - Hàng 2hand, legit',
      price: 250000,
      quantity: 1, // Quantity is from cart, but displayed as a list item here
      image: 'https://via.placeholder.com/150',
      color: 'Pink',
      size: 'M',
    },
    {
      id: 2,
      name: 'Áo hoddie superme đen chữ đỏ',
      price: 170000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      color: 'Pink',
      size: 'M',
    },
  ];

  const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+84932000000'); // Initial data
  const [email, setEmail] = useState('amandamorgan@example.com'); // Initial data

  const handleSaveContact = () => {
    // Logic to save contact information (e.g., update state or call an API)
    console.log('Saving contact info:', { phoneNumber, email });
    // For now, just close the modal
    setContactModalVisible(false);
  };

  // New state for address modal
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  // Mock address data (you would fetch this in a real app)
  const [addressLine1, setAddressLine1] = useState('26, Đường Số 2, P. Thảo Điền'); // Split address
  const [ward, setWard] = useState('An Phú');
  const [district, setDistrict] = useState('Quận 2');
  const [city, setCity] = useState('TP.HCM');

  const handleSaveAddress = () => {
    // Logic to save address information
    console.log('Saving address info:', { addressLine1, ward, district, city });
    setAddressModalVisible(false);
  };

  // New state for voucher modal
  const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);

  // Mock voucher data
  const vouchers = [
    {
      id: 1,
      name: 'Đơn hàng đầu tiên',
      description: 'Giảm 5% cho đơn hàng đầu tiên của bạn',
      expiryDate: '5.16.20', // Mock date
      icon: 'bag-handle-outline', // Ionicons name
    },
    {
      id: 2,
      name: 'Ưu đãi Giáng sinh',
      description: 'Giảm 15% cho đơn hàng trên 1 triệu',
      expiryDate: '5.16.20', // Mock date
      icon: 'gift-outline', // Ionicons name
    },
    // Add more mock vouchers as needed
  ];

  // New state for applied voucher
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Stores the applied voucher object

  const handleApplyVoucher = (voucher) => {
    // Logic to apply the voucher
    console.log('Applying voucher:', voucher);
    setAppliedVoucher(voucher); // Set the applied voucher
    // Close the modal after applying (or navigate, show confirmation, etc.)
    setVoucherModalVisible(false);
  };

  const handleRemoveVoucher = () => {
    // Logic to remove the applied voucher
    console.log('Removing voucher:', appliedVoucher);
    setAppliedVoucher(null); // Clear the applied voucher
  };

  // New state for payment method modal
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  // State to track the selected payment method
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(1); // Default to the first card

  // Mock payment method data (for display in modal)
  const mockPaymentMethods = [
    {
      id: 1,
      brand: 'mastercard', // Placeholder
      last4: '1579',
      expiry: '12/22',
      cardholder: 'AMANDA MORGAN',
    },
    {
      id: 2,
      brand: 'visa', // Placeholder
      last4: '5678',
      expiry: '11/24',
      cardholder: 'AMANDA MORGAN', // Using same name for mock data
    },
    // Add more mock cards as needed
  ];

  const handleSelectPaymentMethod = (id) => {
    setSelectedPaymentMethodId(id);
  };

  // New states for feedback modals
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null); // 'success' or 'failure'

  const handleCheckout = () => {
    // Simulate a payment process
    const success = Math.random() > 0.5; // 50% chance of success

    if (success) {
      setFeedbackType('success');
    } else {
      setFeedbackType('failure');
    }
    setFeedbackModalVisible(true);
  };

  const handleTryAgain = () => {
    setFeedbackModalVisible(false);
    // Optionally, re-run handleCheckout or trigger payment process again
    console.log('Attempting checkout again...');
    // handleCheckout(); // Uncomment to enable retry
  };

  const handleChangePaymentMethod = () => {
    setFeedbackModalVisible(false);
    setPaymentModalVisible(true); // Open payment method modal
  };

  const handleViewOrder = () => {
    setFeedbackModalVisible(false);
    // Navigate to order details screen
    console.log('Navigating to order details...');
    navigation.navigate('OrderDetails'); // Navigate to OrderDetailsScreen
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Địa chỉ giao hàng */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Ionicons name="pencil" size={20} color="#323660" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
             <Text style={styles.infoText}>26, Đường Số 2, P. Thảo Điền, An Phú, Quận 2,</Text>
             <Text style={styles.infoText}>TP.HCM</Text>
          </View>
        </View>

        {/* Thông tin liên hệ */}
         <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <TouchableOpacity onPress={() => setContactModalVisible(true)}>
              <Ionicons name="pencil" size={20} color="#323660" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
             <Text style={styles.infoText}>+84932000000</Text>
             <Text style={styles.infoText}>amandamorgan@example.com</Text>
          </View>
        </View>

        {/* Sản phẩm */}
         <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
            <View style={styles.itemCountBadge}>
             <Text style={styles.itemCountText}>{products.length}</Text>
           </View>
            {appliedVoucher ? (
              <View style={styles.appliedVoucherChip}>
                <Text style={styles.appliedVoucherText}>5% Discount</Text>{/* Hardcoded for now, can be dynamic */}
                <TouchableOpacity onPress={handleRemoveVoucher}>
                  <Ionicons name="close-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addVoucherButton} onPress={() => setVoucherModalVisible(true)}>
                <Text style={styles.addVoucherButtonText}>Thêm Voucher</Text>
              </TouchableOpacity>
            )}
          </View>

          {products.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productColorSize}>{`${item.color}, Size ${item.size}`}</Text>
                <Text style={styles.productPrice}>
                  {item.price.toLocaleString('vi-VN')}đ
                </Text>
              </View>
               <View style={styles.quantityContainer}>
                 <Text style={styles.quantityText}>{item.quantity}</Text>
               </View>
            </View>
          ))}
        </View>

        {/* Phương thức thanh toán */}
         <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <TouchableOpacity onPress={() => setPaymentModalVisible(true)}>
              <Ionicons name="pencil" size={20} color="#323660" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
             <TouchableOpacity style={styles.paymentMethodButton}>
                <Text style={styles.paymentMethodButtonText}>Card</Text>
             </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Footer Total and Checkout Button */}
       <View style={styles.footer}>
           <View style={styles.totalContainer}>
             <Text style={styles.totalText}>Tổng cộng:</Text>
             <Text style={styles.totalAmount}>
               {totalAmount.toLocaleString('vi-VN')}đ
             </Text>
           </View>
           <TouchableOpacity
             style={styles.checkoutButton}
             onPress={handleCheckout}
           >
             <Text style={styles.checkoutButtonText}>Thanh toán</Text>
           </TouchableOpacity>
         </View>

      {/* Contact Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isContactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin liên hệ</Text>
              <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                 <Ionicons name="arrow-forward" size={24} color="#323660" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.modalContent}>
                {/* Phone Number Input */}
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />

                {/* Email Input */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveContact}>
                  <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                {/* Address Line 1 Input (Tên đường/số nhà)*/}
                <Text style={styles.label}>Tên đường/số nhà</Text>
                <TextInput
                  style={styles.input}
                  value={addressLine1}
                  onChangeText={setAddressLine1}
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

      {/* Voucher Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVoucherModalVisible}
        onRequestClose={() => setVoucherModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vouchers</Text>
              {/* Assuming you might want a close button or a forward arrow like other modals */}
               <TouchableOpacity onPress={() => setVoucherModalVisible(false)}>
                 <Ionicons name="close" size={24} color="#333" />
               </TouchableOpacity>
            </View>

            {/* Modal Content - Vouchers List */}
            <ScrollView style={styles.modalContent}>
              {vouchers.map((voucher) => (
                <View key={voucher.id} style={styles.voucherItem}>
                   <View style={styles.voucherLeft}>
                      <View style={styles.voucherClip}></View>
                      <Ionicons name={voucher.icon} size={30} color="#323660" />
                   </View>
                   <View style={styles.voucherCenter}>
                     <Text style={styles.voucherName}>{voucher.name}</Text>
                     <Text style={styles.voucherDescription}>{voucher.description}</Text>
                   </View>
                   <View style={styles.voucherRight}>
                      <Text style={styles.voucherExpiry}>Áp dụng đến {voucher.expiryDate}</Text>
                       <TouchableOpacity style={styles.applyButton} onPress={() => handleApplyVoucher(voucher)}>
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

      {/* Payment Method Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phương thức thanh toán</Text>
               <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                 <Ionicons name="arrow-forward" size={24} color="#333" />{/* Changed to arrow-forward based on image */}
               </TouchableOpacity>
            </View>

            {/* Modal Content - Payment Options */}
            <ScrollView style={styles.modalContentHorizontal} horizontal={true} showsHorizontalScrollIndicator={false}>
                {mockPaymentMethods.map((card) => (
                  <TouchableOpacity key={card.id} style={styles.paymentCard} onPress={() => handleSelectPaymentMethod(card.id)}>
                     {/* Card Brand Icon */}
                     <View style={styles.cardBrandIconContainer}>
                         {/* Placeholder for Card Icon - use actual image or SVG */}
                         {/* You might conditional render based on card.brand */}
                         <Text style={styles.cardBrandText}>{card.brand === 'mastercard' ? 'MC' : 'Visa'}</Text>
                     </View>
                     {/* Card Details */}
                     <View style={styles.cardDetails}>
                         <Text style={styles.cardNumber}>**** **** **** {card.last4}</Text>
                         <Text style={styles.cardholderName}>{card.cardholder}</Text>
                     </View>
                      {/* Expiry and Settings/Check Icon */}
                     <View style={styles.cardRightInfo}>
                        {selectedPaymentMethodId === card.id ? (
                           <Ionicons name="checkmark-circle" size={24} color="#323660" /> // Checked icon
                        ) : (
                           <TouchableOpacity style={styles.cardSettingsIcon}>
                               <Ionicons name="settings-outline" size={20} color="#323660" />
                           </TouchableOpacity>
                        )}
                        <Text style={styles.cardExpiry}>{card.expiry}</Text>
                     </View>
                  </TouchableOpacity>
                ))}

                {/* Add New Payment Method Card */}
                <TouchableOpacity style={styles.addPaymentMethodCard} onPress={() => { console.log('Add new payment method'); /* Implement navigation or logic */ }}>
                    <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal (Success or Failure) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFeedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.feedbackModalBackground}>
          <View style={styles.feedbackModalContainer}>

            {feedbackType === 'failure' && (
              <View style={styles.feedbackContent}>
                {/* Failure Icon */}
                <View style={styles.feedbackIconContainerFailure}>
                  <Ionicons name="warning" size={40} color="#fff" />
                </View>
                {/* Failure Message and Description */}
                <Text style={styles.feedbackTitle}>Chúng tôi không thể tiến hành thanh toán của bạn</Text>
                <Text style={styles.feedbackDescription}>Vui lòng thay đổi phương thức thanh toán hoặc thử lại</Text>
                {/* Failure Buttons */}
                <View style={styles.feedbackButtonContainer}>
                  <TouchableOpacity style={[styles.feedbackButton, styles.feedbackButtonSecondary]} onPress={handleTryAgain}>
                    <Text style={styles.feedbackButtonTextSecondary}>Thử lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.feedbackButton, styles.feedbackButtonPrimary]} onPress={handleChangePaymentMethod}>
                    <Text style={styles.feedbackButtonTextPrimary}>Thay đổi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {feedbackType === 'success' && (
              <View style={styles.feedbackContent}>
                {/* Success Icon */}
                <View style={styles.feedbackIconContainerSuccess}>
                  <Ionicons name="checkmark" size={40} color="#fff" />
                </View>
                {/* Success Message and Description */}
                 <Text style={styles.feedbackTitle}>Thành công</Text>
                <Text style={styles.feedbackDescription}>Thanh toán đơn hàng của bạn đã hoàn tất</Text>
                {/* Success Button */}
                <View style={styles.feedbackButtonContainer}>
                   <TouchableOpacity style={[styles.feedbackButton, styles.feedbackButtonSecondary]} onPress={handleViewOrder}>  
                       <Text style={styles.feedbackButtonTextSecondary}>Xem đơn hàng</Text>
                   </TouchableOpacity>
                </View>
              </View>
            )}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Light gray background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    // Styles for content within sections if needed
  },
  infoText: {
      fontSize: 16,
      color: '#555',
      marginBottom: 4,
  },
   addVoucherButton:{
       borderWidth: 1,
       borderColor: '#ccc',
       borderRadius: 20,
       paddingHorizontal: 12,
       paddingVertical: 4,
       marginLeft: 'auto',
   },
    addVoucherButtonText:{
        fontSize: 14,
        color: '#555',
    },
   itemCountBadge: {
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 8,
   },
   itemCountText: {
       fontSize: 12,
       color: '#333',
       fontWeight: 'bold',
   },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
    fontWeight: '500',
  },
  productColorSize:{
      fontSize: 13,
      color: '#666',
      marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e91e63',
    marginTop: 4,
  },
   quantityContainer:{
       marginLeft: 12,
       backgroundColor: '#e0e0e0',
       borderRadius: 4,
       paddingHorizontal: 8,
       paddingVertical: 4,
   },
    quantityText:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentMethodButton:{
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: 'flex-start', // Align button to the start
    },
    paymentMethodButtonText:{
        fontSize: 15,
        color: '#333',
    },

  footer: {
    paddingBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  totalContainer: {
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

  // Modal Styles
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
    // Styles for content within modal - add padding if needed
    paddingVertical: 10, // Add some vertical padding
  },
    label: { // Reusing styles from the standalone screen, may need adjustments
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8, // Adjusted margin
        marginBottom: 4,
        color: '#333',
    },
    input: { // Reusing styles from the standalone screen
        backgroundColor: '#f8f8f8', // Lighter background for input
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
    },
    saveButton: { // Reusing styles from the standalone screen
        backgroundColor: '#323660',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20, // Adjusted margin
    },
    saveButtonText: { // Reusing styles from the standalone screen
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

  // New Voucher Modal Styles (add these)
  voucherItem: {
    flexDirection: 'row',
    backgroundColor: '#e0eaff', // Light blue background from image
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#c6d9ff', // Slightly darker blue border
    borderStyle: 'dashed', // Dotted border
    position: 'relative', // Needed for absolute positioning of clips
    overflow: 'hidden', // Hide the absolutely positioned pseudo-elements that extend outside
  },
    voucherLeft: {
        width: 50, // Adjust as needed for icon spacing
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    voucherCenter: {
        flex: 1,
        justifyContent: 'center',
    },
    voucherRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginLeft: 10,
    },
    voucherName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#323660', // Dark blue color
        marginBottom: 4,
    },
    voucherDescription: {
        fontSize: 13,
        color: '#555',
    },
    voucherExpiry: {
        fontSize: 11,
        color: '#777',
        marginBottom: 8,
    },
    applyButton: {
        backgroundColor: '#323660', // Dark blue button
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    voucherClip: {
      position: 'absolute',
      left: -15, // Half of the diameter to make it look like a clip
      width: 30,
      height: 30,
      borderRadius: 15, // Makes it a circle
      backgroundColor: '#f8f8f8', // Match background color
      top: '50%',
      transform: [{ translateY: -15 }], // Center vertically
    },
     voucherRightClip: {
      position: 'absolute',
      right: -15, // Half of the diameter to make it look like a clip
      width: 30,
      height: 30,
      borderRadius: 15, // Makes it a circle
      backgroundColor: '#f8f8f8', // Match background color
      top: '50%',
      transform: [{ translateY: -15 }], // Center vertically
    },

   // Styles for Applied Voucher Chip
   appliedVoucherChip: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#323660', // Dark blue background from image
       borderRadius: 20,
       paddingHorizontal: 12,
       paddingVertical: 4,
       marginLeft: 'auto', // Align to the right
   },
   appliedVoucherText: {
       fontSize: 14,
       color: '#fff', // White text
       fontWeight: 'bold',
       marginRight: 4,
   },

  // New Payment Method Modal Styles
  modalContentHorizontal: {
      paddingHorizontal: 10, // Add some horizontal padding for the scroll view
  },
  paymentCard: {
    flexDirection: 'row',
    backgroundColor: '#e0eaff', // Light blue background
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 12, // Space between cards
    width: 250, // Fixed width for each card, adjust as needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
    cardBrandIconContainer: {
        width: 50, // Adjust size as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBrandText: {
        fontSize: 12,
        color: '#333', // Placeholder text style
    },
    cardDetails: {
        flex: 1,
        marginLeft: 10,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardholderName: {
        fontSize: 14,
        color: '#555',
    },
    cardRightInfo: {
        alignItems: 'flex-end',
    },
    cardSettingsIcon: {
        marginBottom: 8,
    },
    cardExpiry: {
        fontSize: 14,
        color: '#555',
    },
  addPaymentMethodCard: {
    backgroundColor: '#323660', // Dark blue background
    borderRadius: 8,
    width: 80, // Width for the add card button
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12, // Space after the last card
  },

  // Styles for Feedback Modals (Success/Failure) - Add these new styles
  feedbackModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  feedbackContent: {
      alignItems: 'center',
  },
  feedbackIconContainerFailure: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c', // Red color for failure
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
   feedbackIconContainerSuccess: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2ecc71', // Green color for success
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  feedbackButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
   feedbackButtonContainerSingle: {
       width: '100%',
       paddingHorizontal: 5, // Add horizontal padding here
   },
  feedbackButton: {
    flex: 1, // Take equal space
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackButtonPrimary: {
    backgroundColor: '#323660', // Dark blue for primary action
  },
  feedbackButtonSecondary: {
    backgroundColor: '#e0e0e0', // Light gray for secondary action
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feedbackButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackButtonTextSecondary: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen; 
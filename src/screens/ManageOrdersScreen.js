import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList, // Use FlatList for rendering lists efficiently
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManageOrdersScreen = ({ navigation }) => {
  // Mock data for orders list (replace with actual data fetching)
  const orders = [
    {
      id: 1,
      orderId: '#92287157',
      product: {
        name: 'Mắt kính chanel',
        shippingMethod: 'Giao Hàng tiêu chuẩn',
        status: 'Đã đóng gói',
        image: 'https://via.placeholder.com/100', // Placeholder image
      },
      action: 'Theo dõi', // 'Theo dõi' or 'Đánh giá'
    },
    {
      id: 2,
       orderId: '#92287157',
      product: {
        name: 'Áo khoác Supreme',
        shippingMethod: 'Giao hàng tiêu chuẩn',
        status: 'Đang vận chuyển',
        image: 'https://via.placeholder.com/100', // Placeholder image
      },
      action: 'Theo dõi',
    },
     {
      id: 3,
       orderId: '#92287157',
      product: {
        name: 'Quần Jean Whose',
        shippingMethod: 'Giao hàng tiêu chuẩn',
        status: 'Đã Nhận',
      image: 'https://via.placeholder.com/100', // Placeholder image
      },
      action: 'Đánh giá',
    },
    {
        id: 4, // New failed order
        orderId: '#92287158', // Different order ID
        product: {
            name: 'Áo thun Nike', // Example product name
            shippingMethod: 'Giao hàng tiêu chuẩn',
            status: 'Giao hàng không thành công',
            image: 'https://via.placeholder.com/100', // Placeholder image
        },
        action: 'Theo dõi', // Still 'Theo dõi' button
        isFailed: true, // Flag to indicate failed delivery
    },
    {
        id: 5, // New successful order
        orderId: '#92287159', // Different order ID
        product: {
            name: 'Áo khoác zip', // Example product name
            shippingMethod: 'Giao hàng tiêu chuẩn',
            status: 'Giao hàng thành công',
            image: 'https://via.placeholder.com/100', // Placeholder image
        },
        action: 'Theo dõi', // Should still be 'Theo dõi' before rating
        isSuccessful: true, // Flag to indicate successful delivery
    },
    // Add more mock orders as needed
  ];

  // State cho modal đánh giá
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  // State cho modal hoàn thành
  const [isCompleteModalVisible, setCompleteModalVisible] = useState(false);
  const [lastRating, setLastRating] = useState(0);

  // Hàm mở modal đánh giá
  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setRating(0);
    setReviewText('');
    setReviewModalVisible(true);
  };

  // Hàm gửi đánh giá
  const handleSendReview = () => {
    setReviewModalVisible(false);
    setLastRating(rating);
    setTimeout(() => setCompleteModalVisible(true), 300);
    setTimeout(() => setCompleteModalVisible(false), 1800);
  };

  // Render dãy sao
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={36}
            color={'#FFB800'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>{stars}</View>;
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.shippingMethod}>{item.product.shippingMethod}</Text>
        <Text style={styles.orderStatus}>{item.product.status}</Text>
      </View>
      <View style={styles.orderItemRight}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          {item.action === 'Theo dõi' ? (
              <TouchableOpacity style={styles.actionButton} onPress={() => {
                  if (item.isFailed) {
                      navigation.navigate('FailedDeliveryDetails');
                  } else if (item.isSuccessful) {
                      navigation.navigate('SuccessfulDeliveryDetails');
                  } else {
                      navigation.navigate('OrderDetails');
                  }
              }}>
                  <Text style={styles.actionButtonText}>{item.action}</Text>
              </TouchableOpacity>
          ) : (
               <TouchableOpacity style={styles.actionButton} onPress={() => openReviewModal(item)}>
                  <Text style={styles.actionButtonText}>{item.action}</Text>
              </TouchableOpacity>
          )}
          {item.product.status === 'Đã Nhận' && (
              <Ionicons name="checkmark-circle" size={20} color="#323660" style={styles.receivedIcon} />
          )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           {/* Placeholder for avatar/icon */}
           <View style={styles.avatarPlaceholder}></View>
           <View>
             <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
             <Text style={styles.headerSubtitle}>Trạng thái đơn hàng</Text>
           </View>
        </View>

        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Activity')}>
                 <Ionicons name="list" size={24} color="#323660" />{/* Placeholder icon */}
            </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="settings-outline" size={24} color="#323660" />{/* Placeholder icon */}
            </TouchableOpacity>
        </View>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={modalStyles.modalBackground}>
              <View style={modalStyles.modalContainer}>
                {/* Tiêu đề */}
                <Text style={modalStyles.modalTitle}>Đánh giá</Text>
                {/* Thông tin người bán và đơn hàng */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={modalStyles.avatar}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, color: '#333' }}>
                      Người bán: <Text style={{ fontWeight: 'bold' }}>Tường An</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#323660', fontWeight: 'bold' }}>
                      Đơn hàng {selectedOrder?.orderId}
                    </Text>
                  </View>
                </View>
                {/* Dãy sao */}
                {renderStars()}
                {/* Ô nhập đánh giá */}
                <TextInput
                  style={modalStyles.textInput}
                  placeholder="Nhập đánh giá của bạn..."
                  placeholderTextColor="#888"
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                  numberOfLines={4}
                />
                {/* Nút gửi */}
                <TouchableOpacity style={modalStyles.sendButton} onPress={handleSendReview}>
                  <Text style={modalStyles.sendButtonText}>Gửi đi!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Complete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCompleteModalVisible}
        onRequestClose={() => setCompleteModalVisible(false)}
      >
        <View style={completeModalStyles.overlay}>
          <View style={completeModalStyles.container}>
            <View style={completeModalStyles.iconCircle}>
              <Ionicons name="checkmark" size={32} color="#323660" />
            </View>
            <Text style={completeModalStyles.title}>Hoàn thành!</Text>
            <Text style={completeModalStyles.subtitle}>Cảm ơn bài đánh giá của bạn</Text>
            <View style={completeModalStyles.starsRow}>
              {[1,2,3,4,5].map(i => (
                <Ionicons
                  key={i}
                  name={i <= lastRating ? 'star' : 'star-outline'}
                  size={36}
                  color={'#FFB800'}
                  style={{ marginHorizontal: 2 }}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>

       {/* Footer (Placeholder for Tab Bar) */}
       {/* This screen should ideally be part of the Tab Navigator structure */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e0e0e0', // Placeholder color
      marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
   headerSubtitle: {
       fontSize: 14,
       color: '#666',
   },
   headerIcons: {
       flexDirection: 'row',
   },
   headerIcon: {
       marginLeft: 15,
   },
  listContentContainer: {
      padding: 16,
  },
  orderItemContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
       shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
  },
  productImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
  },
  orderItemDetails: {
      flex: 1,
      marginRight: 12,
  },
   productName: {
       fontSize: 16,
       fontWeight: 'bold',
       marginBottom: 4,
   },
   shippingMethod: {
       fontSize: 14,
       color: '#555',
       marginBottom: 8,
   },
   orderStatus: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#323660', // Dark blue color
   },
   orderItemRight: {
       alignItems: 'flex-end',
       justifyContent: 'space-between',
   },
   orderId: {
       fontSize: 12,
       color: '#777',
       marginBottom: 8,
   },
   actionButton: {
       backgroundColor: '#323660', // Dark blue button
       borderRadius: 4,
       paddingVertical: 6,
       paddingHorizontal: 12,
       alignItems: 'center',
   },
   actionButtonText: {
       color: '#fff',
       fontSize: 13,
       fontWeight: 'bold',
   },
    receivedIcon: {
        marginLeft: 0,
        marginTop: 8, // Space below the button
    },
});

// Thêm style cho modal đánh giá và hoàn thành
const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'left',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 18,
    minHeight: 70,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#323660',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 0,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const completeModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingTop: 44,
    paddingBottom: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  iconCircle: {
    position: 'absolute',
    top: -32,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#E6E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },
});

export default ManageOrdersScreen; 
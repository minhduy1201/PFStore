import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrdersByBuyer } from '../servers/OrderService';
import { createRating } from '../servers/ProductService';

const ManageOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
            console.log("Fetching orders for userId:", userId);
            const fetchedOrders = await getOrdersByBuyer(userId);
            if (fetchedOrders) {
              const userIdInt = parseInt(userId);
              const formattedOrders = fetchedOrders.map(order => {
                const allProductsReviewed = order.orderDetails.every(detail =>
                  detail.product.ratings.some(rating => rating.userId === userIdInt)
                );

                return {
                  id: order.orderId, // Use orderId as the key
                  orderId: `#${order.orderId}`,
                  rawOrderId: order.orderId,
                  products: order.orderDetails.map(detail => ({
                    productId: detail.product.productId,
                    name: detail.product.title,
                    image: detail.product.productImages && detail.product.productImages.length > 0
                      ? detail.product.productImages[0].imageUrl
                      : 'https://via.placeholder.com/100',
                    isReviewed: detail.product.ratings.some(rating => rating.userId === userIdInt),
                  })),
                  status: order.status,
                  shippingMethod: 'Giao hàng tiêu chuẩn',
                  action: (order.status === 'Đã Nhận' || order.status === 'Giao hàng thành công' || order.status === 'delivered') ? 'Đánh giá' : 'Theo dõi',
                  isFailed: order.status === 'Giao hàng không thành công',
                  isSuccessful: order.status === 'Giao hàng thành công',
                  isReviewed: allProductsReviewed, // Represents if the entire order is reviewed
                };
              });
              setOrders(formattedOrders);
            }
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
          // Error is already handled by handleApiError in the service
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

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
  const handleSendReview = async () => {
    if (!selectedOrder) return;

    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            Alert.alert("Lỗi", "Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        const ratingData = {
            userId: parseInt(userId),
            productId: selectedOrder.product.productId,
            stars: rating,
            comment: reviewText,
        };

        await createRating(ratingData);

        setReviewModalVisible(false);
        setLastRating(rating);
        setTimeout(() => setCompleteModalVisible(true), 300);
        setTimeout(() => setCompleteModalVisible(false), 1800);

    } catch (error) {
        // The error is already handled by handleApiError in the service
        // You might want to add additional logic here if needed
        console.log("Failed to submit review from component");
    }
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
      <Image source={{ uri: item.products.length > 0 ? item.products[0].image : 'https://via.placeholder.com/100' }} style={styles.productImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item.products.map(p => p.name).join(', ')}</Text>
        <Text style={styles.shippingMethod}>{`${item.products.length} sản phẩm`}</Text>
        <Text style={styles.orderStatus}>{item.status}</Text>
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
                      navigation.navigate('OrderDetails', { orderId: item.rawOrderId });
                  }
              }}>
                  <Text style={styles.actionButtonText}>{item.action}</Text>
              </TouchableOpacity>
          ) : (
               <TouchableOpacity 
                  style={[styles.actionButton, item.isReviewed && styles.disabledButton]} 
                  onPress={() => {
                    if (item.isReviewed) return;

                    if (item.products.length > 1) {
                      // Placeholder for navigating to a new screen for multi-product review
                      navigation.navigate('RateProducts', { order: item });
                    } else if (item.products.length === 1) {
                      const productToReview = item.products[0];
                      if (!productToReview.isReviewed) {
                        openReviewModal({
                            orderId: item.orderId,
                            product: {
                                productId: productToReview.productId,
                                name: productToReview.name,
                            },
                        });
                      }
                    }
                  }}
                  disabled={item.isReviewed}
                >
                  <Text style={styles.actionButtonText}>{item.isReviewed ? 'Đã đánh giá' : 'Đánh giá'}</Text>
              </TouchableOpacity>
          )}
          {item.status === 'Đã Nhận' && (
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
      {loading ? (
        <ActivityIndicator size="large" color="#323660" style={{ flex: 1 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
        />
      )}

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <TouchableOpacity
          style={modalStyles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setReviewModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <TouchableWithoutFeedback>
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

                {/* Stars */}
                {renderStars()}
                
                {/* Input */}
                <TextInput
                  style={modalStyles.input}
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                  multiline
                  value={reviewText}
                  onChangeText={setReviewText}
                />

                {/* Nút gửi */}
                <TouchableOpacity style={modalStyles.sendButton} onPress={handleSendReview}>
                  <Text style={modalStyles.sendButtonText}>Gửi đi</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </TouchableOpacity>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
   disabledButton: {
      backgroundColor: '#c0c0c0', // Gray color for disabled button
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
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
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
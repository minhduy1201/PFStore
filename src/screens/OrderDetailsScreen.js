import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getOrderById } from '../servers/OrderService';

const OrderDetailsScreen = ({ navigation, route }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = route.params?.orderId;

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError('Không có ID đơn hàng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const order = await getOrderById(orderId);
      
      if (order) {
        setOrderDetails(order);
      } else {
        setError('Không thể tải thông tin đơn hàng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thông tin đơn hàng');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
    }, [orderId])
  );

  // Hàm chuyển đổi trạng thái đơn hàng sang tiếng Việt
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy',
      'returned': 'Đã hoàn trả'
    };
    return statusMap[status] || status;
  };

  // Hàm chuyển đổi trạng thái giao hàng sang tiếng Việt
  const getDeliveryStatusText = (deliveryStatus) => {
    const deliveryStatusMap = {
      'waiting': 'Chờ giao hàng',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'failed': 'Giao hàng thất bại'
    };
    return deliveryStatusMap[deliveryStatus] || deliveryStatus;
  };

  // Hàm tạo lịch sử đơn hàng dựa trên trạng thái
  const generateOrderHistory = (order) => {
    const history = [];
    
    // Đơn hàng đã được tạo
    history.push({
      status: 'Đã đặt hàng',
      description: 'Bạn đã xác nhận mua hàng và đang chờ người bán xác nhận',
      date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', ' -'),
      completed: true
    });

    // Nếu đã xác nhận
    if (order.status === 'confirmed' || order.status === 'shipping' || order.status === 'delivered') {
      history.push({
        status: 'Đã xác nhận',
        description: 'Người bán đã xác nhận đơn hàng của bạn',
        date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ' -'),
        completed: true
      });
    }

    // Nếu đang giao hàng
    if (order.status === 'shipping' || order.status === 'delivered') {
      history.push({
        status: 'Đang giao hàng',
        description: 'Đơn hàng đang được vận chuyển đến bạn',
        date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ' -'),
        completed: true
      });
    }

    // Nếu đã giao hàng
    if (order.status === 'delivered') {
      history.push({
        status: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao thành công',
        date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ' -'),
        completed: true
      });
    }

    // Nếu đã hủy
    if (order.status === 'cancelled') {
      history.push({
        status: 'Đã hủy',
        description: 'Đơn hàng đã được hủy',
        date: new Date(order.createdAt).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ' -'),
        completed: true
      });
    }

    return history;
  };

  // Hàm tính bước hiện tại trong quá trình đơn hàng
  const getCurrentStep = (order) => {
    switch (order.status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'shipping':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1; // Đã hủy
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#323660" />
          <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !orderDetails) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>{error || 'Không thể tải thông tin đơn hàng'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const orderHistory = generateOrderHistory(orderDetails);
  const currentStep = getCurrentStep(orderDetails);
  const progressSteps = [0, 1, 2, 3]; // 4 bước: Đặt hàng, Xác nhận, Giao hàng, Hoàn thành

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <View style={styles.avatarPlaceholder}></View>
           <View>
             <Text style={styles.headerTitle}>Đơn hàng #{orderDetails.orderId}</Text>
             <Text style={styles.headerSubtitle}>{getStatusText(orderDetails.status)}</Text>
           </View>
        </View>

        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
                 <Ionicons name="list" size={24} color="#323660" />
            </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="settings-outline" size={24} color="#323660" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Thông tin địa chỉ giao hàng */}
        {orderDetails.address && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{orderDetails.address.fullName}</Text>
              <Text style={styles.addressPhone}>{orderDetails.address.phoneNumber}</Text>
              <Text style={styles.addressText}>
                {orderDetails.address.addressLine}, {orderDetails.address.city}
              </Text>
            </View>
          </View>
        )}

        {/* Danh sách sản phẩm */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sản phẩm ({orderDetails.orderDetails?.length || 0})</Text>
          {orderDetails.orderDetails?.map((item, index) => (
            <View key={index} style={styles.productItem}>
              <Image 
                source={{ uri: item.product?.productImages[0]?.imageUrl || 'https://via.placeholder.com/150' }} 
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product?.title || item.productTitle || 'Sản phẩm không xác định'}</Text>
                <Text style={styles.productPrice}>
                  {item.snapshotPrice?.toLocaleString('vi-VN')}đ x {item.quantity}
                </Text>
                <Text style={styles.productTotal}>
                  Tổng: {(item.snapshotPrice * item.quantity).toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Thông tin thanh toán */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          <View style={styles.paymentInfo}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Tổng tiền hàng:</Text>
              <Text style={styles.paymentValue}>
                {orderDetails.totalPrice?.toLocaleString('vi-VN')}đ
              </Text>
            </View>
            {orderDetails.discountAmount > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Giảm giá:</Text>
                <Text style={styles.paymentValueDiscount}>
                  -{orderDetails.discountAmount?.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            )}
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Tổng cộng:</Text>
              <Text style={styles.paymentValueTotal}>
                {orderDetails.finalTotal?.toLocaleString('vi-VN')}đ
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Trạng thái thanh toán:</Text>
              <Text style={[styles.paymentValue, { color: orderDetails.paidStatus ? '#27ae60' : '#e74c3c' }]}>
                {orderDetails.paidStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Progress Bar */}
        {currentStep >= 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tiến trình đơn hàng</Text>
            <View style={styles.progressBarContainer}>
               {progressSteps.map((step) => (
                   <View key={step} style={[styles.progressDot, step <= currentStep && styles.progressDotActive]}></View>
               ))}
               <View style={styles.progressBarLine}></View>
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Đặt hàng</Text>
              <Text style={styles.progressLabel}>Xác nhận</Text>
              <Text style={styles.progressLabel}>Giao hàng</Text>
              <Text style={styles.progressLabel}>Hoàn thành</Text>
            </View>
          </View>
        )}

        {/* Order History */}
         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Lịch sử đơn hàng</Text>
            {orderHistory.map((historyItem, index) => (
                 <View key={index} style={styles.historyItem}>
                     <View style={[styles.historyDot, historyItem.completed && styles.historyDotCompleted]}></View>
                     <View style={styles.historyContent}>
                         <View style={styles.historyHeader}>
                             <Text style={styles.historyStatus}>{historyItem.status}</Text>
                             <Text style={styles.historyDate}>{historyItem.date}</Text>
                         </View>
                          <Text style={styles.historyDescription}>{historyItem.description}</Text>
                     </View>
                 </View>
            ))}
        </View>

      </ScrollView>
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
      backgroundColor: '#e0e0e0',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addressInfo: {
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#555',
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  productTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  paymentInfo: {
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#555',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentValueDiscount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  paymentValueTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    position: 'relative',
  },
  progressBarLine: {
    position: 'absolute',
    top: '50%',
    left: 25,
    right: 25,
    height: 4,
    backgroundColor: '#e0e0e0',
    zIndex: -1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  progressDotActive: {
    backgroundColor: '#323660',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginTop: 5,
    marginRight: 10,
  },
  historyDotCompleted: {
    backgroundColor: '#323660',
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDate: {
    fontSize: 13,
    color: '#777',
  },
  historyDescription: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#323660',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen; 
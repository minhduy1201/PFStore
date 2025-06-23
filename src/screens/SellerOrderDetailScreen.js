import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { updateOrderStatus } from '../servers/OrderService';
import { MaterialIcons } from '@expo/vector-icons';

const ORDER_STATUS = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Đã xác nhận',
  'shipping': 'Đang giao hàng',
  'delivered': 'Đã giao hàng',
  'cancelled': 'Đã hủy',
  'returned': 'Đã hoàn trả',
};

const SellerOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const handleConfirmOrder = async () => {
    try {
      await updateOrderStatus(order.orderId, 'confirmed');
      Alert.alert('Thành công', 'Đã xác nhận đơn hàng!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#4caf50';
      case 'shipping': return '#2196f3';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      case 'returned': return '#795548';
      default: return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Mã đơn:</Text>
          <Text style={styles.value}>#{order.orderId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Khách hàng:</Text>
          <Text style={styles.value}>{order.otherUserName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ngày tạo:</Text>
          <Text style={styles.value}>{order.createdAt && order.createdAt.split('T')[0]}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{ORDER_STATUS[order.status]}</Text>
          </View>
        </View>
      </View>

      {order.status === 'pending' && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmButtonText}>Xác nhận đơn hàng</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50, // Thêm padding cho status bar
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#2196f3',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SellerOrderDetailScreen; 
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, Platform } from 'react-native';
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

const STATUS_OPTIONS = [
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'shipping', label: 'Đang giao hàng' },
  { key: 'delivered', label: 'Đã giao hàng' },
  { key: 'cancelled', label: 'Đã hủy' },
  { key: 'returned', label: 'Đã hoàn trả' },
];

const SellerOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.orderId, newStatus);
      setCurrentStatus(newStatus);
      setModalVisible(false);
      Alert.alert('Thành công', 'Cập nhật trạng thái thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng!');
    }
    setUpdating(false);
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

  // Lọc các trạng thái có thể chuyển đổi (không cho chọn lại trạng thái hiện tại)
  const availableStatusOptions = STATUS_OPTIONS.filter(opt => opt.key !== currentStatus);

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
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.statusText}>{ORDER_STATUS[currentStatus]}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(true)} disabled={updating}>
        <Text style={styles.confirmButtonText}>{updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}</Text>
      </TouchableOpacity>

      {/* Modal chọn trạng thái mới */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Chọn trạng thái mới</Text>
            {availableStatusOptions.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.statusOption}
                onPress={() => handleUpdateStatus(opt.key)}
                disabled={updating}
              >
                <Text style={{ fontSize: 16 }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={{ color: '#f44336', fontWeight: 'bold' }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  statusOption: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
    alignItems: 'center',
  },
});

export default SellerOrderDetailScreen; 
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getSellerOrders } from '../servers/OrderService';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserId } from '../servers/AuthenticationService';

const ORDER_STATUS = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Đã xác nhận',
  'shipping': 'Đang giao hàng',
  'delivered': 'Đã giao hàng',
  'cancelled': 'Đã hủy',
  'returned': 'Đã hoàn trả',
};

const SellerOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    const fetchSellerIdAndOrders = async () => {
      const id = await getUserId();
      setSellerId(id);
      if (id) fetchOrders(id);
      else setLoading(false);
    };
    fetchSellerIdAndOrders();
    // Lắng nghe khi màn hình được focus để reload
    const unsubscribe = navigation.addListener('focus', () => {
      if (sellerId) fetchOrders(sellerId);
    });
    return unsubscribe;
  }, [navigation, sellerId]);

  const fetchOrders = async (id) => {
    setLoading(true);
    try {
      const data = await getSellerOrders(id);
      setOrders(data);
    } catch (error) {
      alert('Lỗi khi lấy danh sách đơn hàng');
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('SellerOrderDetail', { order: item })}
    >
      <View>
        <Text style={styles.orderId}>Mã đơn: {item.orderId}</Text>
        <Text>Khách: {item.otherUserName}</Text>
        <Text>Trạng thái: {ORDER_STATUS[item.status]}</Text>
        <Text>Ngày tạo: {item.createdAt && item.createdAt.split('T')[0]}</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={28} color="#555" />
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#333" />;
  if (!sellerId) return <Text style={{ margin: 30, textAlign: 'center' }}>Không tìm thấy thông tin người dùng</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý bán hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Không có đơn hàng nào</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#333' },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 10,
    padding: 18,
    shadowRadius: 2,
    elevation: 2,
  },
  orderId: { fontWeight: 'bold', marginBottom: 4 },
});

export default SellerOrdersScreen; 
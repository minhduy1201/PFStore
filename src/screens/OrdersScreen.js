import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getOrdersByBuyer, getOrdersBySeller } from "../servers/OrderService";

export default function OrdersScreen({ userId, isBuyer }) {
  const [orders, setOrders] = useState([]);  // State để lưu trữ đơn hàng
  const [loading, setLoading] = useState(true);  // State để xử lý trạng thái loading
  const [error, setError] = useState(null);  // State để lưu thông tin lỗi nếu có

  useEffect(() => {
    const fetchOrders = async () => {
      try {
      let response;
      if (isBuyer) {
        response = await getOrdersByBuyer(userId);  // Lấy đơn hàng của người mua
      } else {
        response = await getOrdersBySeller(userId);  // Lấy đơn hàng của người bán
      }

      console.log("Dữ liệu trả về từ API:", response);
      
      if (Array.isArray(response) && response.length > 0) {
        setOrders(response);  // Lưu dữ liệu vào state orders
      } else {
        setError("Không có đơn hàng.");
      }
      setLoading(false);  // Đổi trạng thái loading khi có dữ liệu
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setError("Không thể tải đơn hàng.");
      setLoading(false);
    }
    };

    fetchOrders();
  }, [userId, isBuyer]);

  // Hàm render từng đơn hàng
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>Đơn hàng #{item.OrderId}</Text>
      <Text>Trạng thái: {item.Status}</Text>
      <Text>Ngày tạo: {new Date(item.CreatedAt).toLocaleDateString()}</Text>
      <Text>Tổng tiền: {item.FinalTotal} VND</Text>
    </View>
  );

  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.OrderId.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  orderItem: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getUserId } from "../servers/AuthenticationService";
import {
  deleteNotification,
  getNotifyByUserId,
} from "../servers/NotificationService";

const NotifyScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);

  // Lấy userId khi component mount
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const id = await getUserId();
      setCurrentUserId(id);
    };
    fetchCurrentUserId();
  }, []);

  // Hàm để tải thông báo
  const fetchNotifications = useCallback(
    async (showLoadingIndicator = true) => {
      if (!currentUserId) {
        // Đợi có userId rồi mới fetch
        setLoading(false);
        return;
      }

      if (showLoadingIndicator) setLoading(true);
      setError(null);
      try {
        const data = await getNotifyByUserId(); // Lấy tất cả thông báo
        setNotifications(data);
      } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
        setError(err.message || "Không thể tải thông báo. Vui lòng thử lại.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentUserId]
  );

  // Sử dụng useFocusEffect để tải thông báo mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      if (currentUserId) {
        fetchNotifications();
      }
      return () => {
        // Cleanup nếu cần
      };
    }, [currentUserId, fetchNotifications])
  );

  // Hàm xử lý khi kéo xuống để làm mới
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  // Hàm xử lý khi nhấn vào thông báo
  const handleNotificationPress = async (item) => {
    // TODO: Gọi API markNotificationAsRead (khi bạn triển khai ở backend)
    // để đánh dấu thông báo là đã đọc
    // if (!item.isRead) {
    //     try {
    //         await markNotificationAsRead(item.notificationId);
    //         setNotifications(prevNotifications =>
    //             prevNotifications.map(notif =>
    //                 notif.notificationId === item.notificationId ? { ...notif, isRead: true } : notif
    //             )
    //         );
    //     } catch (error) {
    //         console.error("Lỗi khi đánh dấu đã đọc:", error);
    //     }
    // }

    // Điều hướng dựa trên loại thông báo và OrderId/ProductId
    if (item.orderId) {
      // Thông báo liên quan đến đơn hàng
      // Kiểm tra loại thông báo để xác định vai trò (người mua/người bán) và điều hướng phù hợp
      if (item.type === "NewOrder" && item.userId === currentUserId) {
        // Đây là thông báo cho người bán về đơn hàng mới
        navigation.navigate("OrderDetailScreen", {
          orderId: item.orderId,
          isSellerView: true,
        });
      } else if (
        (item.type === "OrderAccepted" || item.type === "OrderRejected") &&
        item.userId === currentUserId
      ) {
        // Đây là thông báo cho người mua về trạng thái đơn hàng của họ
        navigation.navigate("OrderDetailScreen", {
          orderId: item.orderId,
          isSellerView: false,
        });
      } else {
        // Trường hợp khác hoặc fallback
        Alert.alert("Thông báo", item.message);
      }
    } else if (item.productId) {
      // Thông báo liên quan đến sản phẩm (ví dụ: sản phẩm hết hàng, sản phẩm mới)
      navigation.navigate("ProductDetailScreen", { productId: item.productId });
    } else {
      // Thông báo chung chung không liên quan đến OrderId/ProductId cụ thể
      Alert.alert("Thông báo", item.message);
    }
  };

  // Hàm xác nhận và xóa thông báo
  const confirmDeleteNotification = (notificationId) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa thông báo này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteNotification(notificationId);
            Alert.alert("Thành công", "Thông báo đã được xóa.");
            setNotifications((prevNotifications) =>
              prevNotifications.filter(
                (n) => n.notificationId !== notificationId
              )
            );
          } catch (err) {
            console.error("Lỗi khi xóa thông báo:", err);
            Alert.alert("Lỗi", "Không thể xóa thông báo. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  // Hiển thị trạng thái loading
  if (loading || currentUserId === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông báo...</Text>
      </View>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchNotifications()}>
          <Text style={styles.retryButton}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Thông báo của bạn</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notificationItem,
              item.isRead ? styles.readNotification : styles.unreadNotification,
            ]}
            onPress={() => handleNotificationPress(item)}
            onLongPress={() => confirmDeleteNotification(item.notificationId)}
          >
            <View style={styles.messageContent}>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationTime}>
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyNotifications}>Không có thông báo nào.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#323660",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unreadNotification: {
    backgroundColor: "#e6f0ff",
  },
  readNotification: {
    backgroundColor: "#f5f5f5",
  },
  messageContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationMessage: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4472C4",
  },
  emptyNotifications: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 50,
    fontSize: 16,
  },
  retryButton: {
    textAlign: "center",
    color: "blue",
    marginTop: 10,
    fontSize: 16,
  },
});

export default NotifyScreen;

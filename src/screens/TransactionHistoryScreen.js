import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList, // Using FlatList for the list of transactions
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTransactionHistoryByUser } from "../servers/OrderService";
import { getUserId } from "../servers/AuthenticationService";
import { getOrdersByBuyer } from "../servers/OrderService";
import { submitRating } from "../servers/RatingService"; 

const TransactionHistoryScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const id = await getUserId();
      setCurrentUserId(id);
    };
    fetchCurrentUserId();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const data = await getOrdersByBuyer(currentUserId); // Lấy lịch sử giao dịch của người dùng
      console.log("Lịch sử giao dịch:", data);
      // Lọc chỉ những đơn hàng có status === "completed"
      const completedTransactions = data.filter(
        (item) => item.status === "completed"
      );

      // Set dữ liệu vào state nếu có đơn hàng đã hoàn thành
      setTransactions(completedTransactions);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử giao dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchTransactionHistory(); // Chỉ gọi khi currentUserId đã được gán
    }
  }, [currentUserId]);
  // State cho modal đánh giá
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  // State cho modal hoàn thành
  const [isCompleteModalVisible, setCompleteModalVisible] = useState(false);
  const [lastRating, setLastRating] = useState(0);

  // Hàm mở modal đánh giá
  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setRating(0);
    setReviewText("");
    setReviewModalVisible(true);
  };

  // Hàm gửi đánh giá
  const handleSendReview = async () => {
    try {
      // Gửi đánh giá lên backend
      await submitRating(
        currentUserId,
        selectedOrder.orderDetails[0].product.productId,
        rating,
        reviewText
      );
      setReviewModalVisible(false);
      Alert.alert("Đánh giá thành công", "Cảm ơn bạn đã gửi đánh giá!");
      // Cập nhật lại lịch sử giao dịch sau khi đánh giá
      const data = await getOrdersByBuyer(currentUserId);
      const completedTransactions = data.filter(
        (item) => item.status === "completed"
      );

      // Set dữ liệu vào state nếu có đơn hàng đã hoàn thành
      setTransactions(completedTransactions);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      Alert.alert("Có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  // Render dãy sao
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={36}
            color={"#FFB800"}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 12,
        }}
      >
        {stars}
      </View>
    );
  };

  const renderTransactionItem = ({ item }) => {
    // Kiểm tra nếu trạng thái là 'completed' và người dùng là người mua
    if (
      transactions.length > 0 &&
      item.status === "completed" &&
      item.buyerId === currentUserId
    ) {
      return (
        <View style={styles.transactionItemContainer}>
          {/* Kiểm tra nếu sản phẩm và hình ảnh tồn tại */}
          {item.orderDetails &&
          item.orderDetails.length > 0 &&
          item.orderDetails[0].product.productImages[0].imageUrl ? (
            <Image
              source={{
                uri: item.orderDetails[0].product.productImages[0].imageUrl,
              }}
              style={styles.productImage}
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text>No image available</Text>
            </View>
          )}
          <View style={styles.transactionItemDetails}>
            <Text style={styles.productName}>
              {item.orderDetails[0].product.title}
            </Text>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <Text style={styles.dateText}>{item.createdAt}</Text>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => openReviewModal(item)}
            >
              <Text style={styles.reviewButtonText}>Đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Nếu không phải đơn hàng đã hoàn thành, trả về null hoặc không hiển thị gì
      return (
        <View style={styles.noImageContainer}>
          <Text>Bạn không có giao dịch nào</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {" "}
          {/* Assuming we might navigate back from here */}
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          {/* Placeholder for avatar/icon */}
          <View style={styles.avatarPlaceholder}></View>
          <View>
            <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
            {/* Subtitle could be added here if needed */}
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="menu" size={24} color="#323660" />
            {/* Placeholder for filter/sort icon */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={24} color="#323660" />
            {/* Placeholder for settings icon */}
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View style={styles.transactionItemContainer}>
            {/* Kiểm tra nếu sản phẩm và hình ảnh tồn tại */}
            {item.orderDetails &&
            item.orderDetails.length > 0 &&
            item.orderDetails[0].product.productImages[0].imageUrl ? (
              <Image
                source={{
                  uri: item.orderDetails[0].product.productImages[0].imageUrl,
                }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text>No image available</Text>
              </View>
            )}
            <View style={styles.transactionItemDetails}>
              <Text style={styles.productName}>
                {item.orderDetails[0].product.title}
              </Text>
              <Text style={styles.orderId}>{item.orderId}</Text>
              <Text style={styles.dateText}>{item.createdAt}</Text>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => openReviewModal(item)}
              >
                <Text style={styles.reviewButtonText}>Đánh giá</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.orderId.toString()}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Đánh giá</Text>
            <Text style={modalStyles.modalText}>
              Sản phẩm: {selectedOrder?.orderDetails[0].product.title}
            </Text>
            {renderStars()}
            <TextInput
              style={modalStyles.textInput}
              placeholder="Nhập đánh giá của bạn..."
              placeholderTextColor="#888"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={modalStyles.sendButton}
              onPress={handleSendReview}
            >
              <Text style={modalStyles.sendButtonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
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
            <Text style={completeModalStyles.subtitle}>
              Cảm ơn bài đánh giá của bạn
            </Text>
            <View style={completeModalStyles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= lastRating ? "star" : "star-outline"}
                  size={36}
                  color={"#FFB800"}
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
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0", // Placeholder color
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 15,
  },
  listContentContainer: {
    padding: 16,
  },
  transactionItemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
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
  transactionItemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  dateReviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateChip: {
    backgroundColor: "#f0f0f0", // Light gray background from image
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "bold",
  },
  reviewButton: {
    borderWidth: 1,
    borderColor: "#323660", // Dark blue border
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  reviewButtonText: {
    color: "#323660", // Dark blue text
    fontSize: 13,
    fontWeight: "bold",
  },
});

// Thêm style cho modal đánh giá
const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 18,
    minHeight: 70,
    color: "#222",
  },
  sendButton: {
    backgroundColor: "#323660",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

// Thêm style cho modal hoàn thành
const completeModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingTop: 44,
    paddingBottom: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  iconCircle: {
    position: "absolute",
    top: -32,
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 6,
    borderColor: "#E6E8F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#222",
    marginBottom: 18,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
  },
});

export default TransactionHistoryScreen;

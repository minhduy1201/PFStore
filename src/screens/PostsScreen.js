// src/screens/PostsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  RefreshControl, // Thêm RefreshControl để kéo xuống làm mới
} from "react-native";
import ProductCard from "../components/ProductCard";
import { fetchUserPosts, deletePost } from "../servers/ProductService"; // Import hàm fetchUserPosts và deletePost
import { MaterialIcons } from "@expo/vector-icons"; // Để icon thêm sản phẩm
import AsyncStorage from "@react-native-async-storage/async-storage"; // Để lưu trữ userId

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); 

  const [userId, setUserId] = useState(null); // State để lưu userId
  useEffect(() => {
    const init = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id && !isNaN(Number(id))) {
          const numericId = Number(id);
          setUserId(numericId);
          await loadPosts(numericId);
        } else {
          Alert.alert("Lỗi", "userId không hợp lệ.");
        }
      } catch (e) {
        Alert.alert("Lỗi", "Không lấy được userId từ bộ nhớ.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Hàm xử lý khi người dùng nhấn vào một sản phẩm (xem chi tiết)
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { productId: product });
  };

  // Hàm xử lý khi người dùng nhấn nút "Chỉnh sửa"
  const handleEditProduct = (product) => {
    Alert.alert("Chỉnh sửa", `Bạn muốn chỉnh sửa sản phẩm: ${product.name}`);
    // navigation.navigate('EditProduct', { productId: product }); // Truyền object sản phẩm để chỉnh sửa
  };

  // Hàm xử lý khi người dùng nhấn nút "Xóa"
  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            setLoading(true); // Đặt loading khi bắt đầu xóa
            try {
              const response = await deletePost(productId); // GỌI HÀM XÓA TỪ PRODUCT SERVICE
              Alert.alert(
                "Thành công",
                response.message || "Sản phẩm đã được xóa!"
              );
              // Cập nhật lại danh sách sản phẩm sau khi xóa thành công
              setPosts((prevPosts) =>
                prevPosts.filter(
                  (post) =>
                    post.productId !== productId && post.id !== productId // lọc cả 2 trường
                )
              );
            } catch (err) {
              // Lỗi đã được handleApiError xử lý hiển thị Alert
              console.error("Lỗi xóa sản phẩm:", err);
            } finally {
              setLoading(false); // Kết thúc xóa
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const loadPosts = async (uid = userId) => {
    try {
      setLoading(true);
      console.log("Gửi request với userId:", uid);
      const data = await fetchUserPosts(uid);
      console.log("✅ Dữ liệu sản phẩm người dùng:", data);
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi fetch user posts:", err);
      setError("Không thể tải danh sách sản phẩm của bạn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, []);

  // Hàm xử lý khi người dùng nhấn nút "Đăng sản phẩm mới"
  const handleCreateNewPost = () => {
    navigation.navigate('CreatePost'); // Chuyển sang màn hình tạo bài đăng mới
  };

  // --- Conditional Rendering ---
  if (loading && posts.length === 0) {
    // Hiển thị loading ban đầu hoặc khi posts rỗng và đang tải lại
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4472C4" />
        <Text style={styles.loadingText}>Đang tải sản phẩm của bạn...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sản Phẩm Của Tôi</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateNewPost}
        >
          <MaterialIcons name="add-circle-outline" size={28} color="#323660" />
        </TouchableOpacity>
      </View>

      {posts.length === 0 && !loading ? ( // Chỉ hiển thị khi không loading và posts rỗng
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Bạn chưa có sản phẩm nào đang rao bán.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateNewPost}
          >
            <Text style={styles.primaryButtonText}>Đăng sản phẩm mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) =>
            item?.id?.toString?.() || index.toString()
          }
          initialNumToRender={10} // Giảm tải ban đầu
          maxToRenderPerBatch={10} // Giảm tải khi cuộn
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onEdit={handleEditProduct} // Truyền hàm edit
              onDelete={handleDeleteProduct} // Truyền hàm delete
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            // Thêm RefreshControl
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4472C4"]} // Màu biểu tượng refresh
              tintColor="#4472C4" // Màu khi kéo
            />
          }
        />
      )}
      {loading &&
        posts.length > 0 && ( // Hiển thị loading overlay khi đang tải lại và đã có dữ liệu
          <View style={styles.overlayLoading}>
            <ActivityIndicator size="large" color="#4472C4" />
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  addButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  overlayLoading: {
    // Loading overlay khi refresh hoặc thao tác
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#4472C4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#323660",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostsScreen;

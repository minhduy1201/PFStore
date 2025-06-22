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
  RefreshControl,
} from "react-native";
import ProductCard from "../components/ProductCard";
import { fetchUserPosts, deletePost } from "../servers/ProductService";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  // Hàm tải bài đăng. userId được truyền vào để đảm bảo load đúng dữ liệu.
  const loadPosts = async (uid) => {
    if (!uid) {
      console.warn("userId chưa sẵn sàng để tải bài đăng.");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      setLoading(true); // Đặt loading trước khi fetch
      console.log("Gửi request với userId:", uid);
      const data = await fetchUserPosts(uid);
      console.log("✅ Dữ liệu sản phẩm người dùng:", data);
      // Đảm bảo data là một mảng trước khi set
      if (Array.isArray(data)) {
        setPosts(data);
        setError(null);
      } else {
        throw new Error("Dữ liệu trả về không phải là mảng.");
      }
    } catch (err) {
      console.error("Lỗi khi fetch user posts:", err);
      setError("Không thể tải danh sách sản phẩm của bạn. Vui lòng thử lại.");
      setPosts([]); // Xóa posts nếu có lỗi
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Sử dụng useEffect để lấy userId ban đầu
  useEffect(() => {
    const getStoredUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id && !isNaN(Number(id))) {
          const numericId = Number(id);
          setUserId(numericId);
        } else {
          Alert.alert("Lỗi", "userId không hợp lệ hoặc không tìm thấy.");
          setUserId(null); // Đảm bảo userId là null nếu không hợp lệ
        }
      } catch (e) {
        Alert.alert("Lỗi", "Không lấy được userId từ bộ nhớ.");
        setUserId(null);
      }
    };
    getStoredUserId();
  }, []); // Chỉ chạy một lần khi component mount

  // Sử dụng useFocusEffect để tải lại bài đăng mỗi khi màn hình được focus
  // và khi userId đã được set
  useFocusEffect(
    useCallback(() => {
      // Đảm bảo userId đã có giá trị trước khi gọi loadPosts
      if (userId !== null) {
        loadPosts(userId);
      }
    }, [userId]) // Dependency userId: chạy lại khi userId thay đổi
  );

  // Hàm xử lý khi người dùng nhấn vào một sản phẩm (xem chi tiết)
  const handleProductPress = (productId) => {
    // Truyền thẳng productId, không cần truyền cả object product nếu ProductDetail chỉ cần ID
    navigation.navigate("ProductDetail", { productId: productId });
  };

  // Hàm xử lý khi người dùng nhấn nút "Chỉnh sửa"
  const handleEditProduct = (productId) => {
    navigation.navigate("CreatePost", { productId: productId });
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
              const response = await deletePost(productId);
              Alert.alert(
                "Thành công",
                response.message || "Sản phẩm đã được xóa!"
              );
              setPosts((prevPosts) =>
                prevPosts.filter((post) => post.productId !== productId)
              );
            } catch (err) {
              console.error("Lỗi xóa sản phẩm:", err);
              Alert.alert("Lỗi", "Không thể xóa sản phẩm. Vui lòng thử lại.");
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

  // Hàm onRefresh cho RefreshControl, gọi lại loadPosts với userId hiện tại
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (userId !== null) {
      loadPosts(userId);
    } else {
      setRefreshing(false); // Không thể refresh nếu userId chưa có
    }
  }, [userId]); // Dependency userId

  // Hàm xử lý khi người dùng nhấn nút "Đăng sản phẩm mới"
  const handleCreateNewPost = () => {
    navigation.navigate("CreatePost"); // Chuyển sang màn hình tạo bài đăng mới
  };

  // --- Conditional Rendering ---
  // Hiển thị loading ban đầu hoặc khi posts rỗng và đang tải lại
  if (loading && posts.length === 0) {
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
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadPosts(userId)}
        >
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

      {posts.length === 0 && !loading ? (
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
            item?.productId?.toString() ||
            item?.id?.toString() ||
            index.toString()
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.productId || item.id)}
              onEdit={() => handleEditProduct(item.productId || item.id)}
              onDelete={() => handleDeleteProduct(item.productId || item.id)}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4472C4"]}
              tintColor="#4472C4"
            />
          }
        />
      )}
      {loading && posts.length > 0 && (
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

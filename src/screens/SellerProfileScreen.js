import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Thêm MaterialCommunityIcons
import { fetchSellerProducts, fetchUserPosts } from "../servers/ProductService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const productItemWidth = width / 2 - 16; // 2 cột với margin 8 ở mỗi bên (8px trái + 8px phải = 16px tổng cho khoảng cách)

const SellerProfileScreen = ({ navigation, route }) => {
  const { sellerId: routeSellerId, sellerName: initialSellerName } =
    route.params || {};

  const [sellerData, setSellerData] = useState({
    name: initialSellerName || "Người bán",
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id && !isNaN(Number(id))) {
          setCurrentUserId(Number(id));
        } else {
          console.warn(
            "userId không hợp lệ hoặc không tìm thấy trong AsyncStorage."
          );
        }
      } catch (e) {
        console.error("Không lấy được userId từ bộ nhớ:", e);
      }
    };
    init();
  }, []);

  const loadSellerProducts = useCallback(async () => {
    if (!routeSellerId) {
      setError("Không tìm thấy ID người bán. Vui lòng thử lại.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);
      console.log(`Đang tải sản phẩm cho người bán với ID: ${routeSellerId}`);
      const productsData = await fetchUserPosts(routeSellerId);
      setSellerData((prev) => ({
        ...prev,
        name: initialSellerName || prev.name,
        products: productsData,
      }));
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm của người bán:", err);
      setError("Không thể tải sản phẩm của người bán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [routeSellerId, initialSellerName]);

  useEffect(() => {
    if (currentUserId !== null && routeSellerId !== undefined) {
      if (Number(routeSellerId) === currentUserId) {
        console.log(
          "Seller ID trùng với Current User ID. Chuyển hướng đến PostsScreen."
        );
        navigation.navigate("PostScreen");
        return;
      } else {
        loadSellerProducts();
      }
    }

    const unsubscribe = navigation.addListener("focus", () => {
      if (currentUserId !== null && Number(routeSellerId) !== currentUserId) {
        loadSellerProducts();
      }
    });
    return unsubscribe;
  }, [navigation, loadSellerProducts, routeSellerId, currentUserId]);

  const handleProductPress = (productId) => {
    navigation.navigate("ProductDetail", { productId: productId });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSellerProducts();
  }, [loadSellerProducts]);

  const formatPrice = (price) => price.toLocaleString("vi-VN") + "₫";

  // // --- Conditional Rendering ---
  // if (loading && sellerData.products.length === 0) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#323660" />
  //       <Text style={styles.loadingText}>Đang tải trang người bán...</Text>
  //     </SafeAreaView>
  //   );
  // }

  // if (error) {
  //   return (
  //     <SafeAreaView style={styles.errorContainer}>
  //       <Text style={styles.errorText}>{error}</Text>
  //       <TouchableOpacity
  //         style={styles.retryButton}
  //         onPress={loadSellerProducts}
  //       >
  //         <Text style={styles.retryButtonText}>Thử lại</Text>
  //       </TouchableOpacity>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trang cá nhân người bán</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.contentContainer}>
        {/* Thông tin người bán */}
        <View style={styles.sellerInfoContainer}>
          <View style={styles.avatarPlaceholder}>
            <Image
              source={{
                uri: sellerData.avatarUrl,
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.sellerName}>{sellerData.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Sản Phẩm Đang Rao Bán</Text>

        {sellerData.products.length === 0 && !loading ? (
          <View style={styles.emptyProductsContainer}>
            <Ionicons name="cube-outline" size={50} color="#888" />
            <Text style={styles.emptyProductsText}>
              Người bán này chưa có sản phẩm nào đang rao bán.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sellerData.products}
            keyExtractor={(item, index) =>
              item?.productId?.toString?.() ||
              item?.id?.toString?.() ||
              index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCardInternal} // Đổi tên style để phân biệt với ProductCard component
                onPress={() => handleProductPress(item.productId || item.id)}
              >
                {/* Product Image */}
                {item.images && item.images.length > 0 && item.images[0] ? (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.productImageInternal}
                  />
                ) : (
                  <View style={styles.imagePlaceholderInternal}>
                    <Text style={{ color: "#aaa" }}>No Image</Text>
                  </View>
                )}

                {/* Product Info */}
                <View style={styles.productInfoInternal}>
                  <Text style={styles.productNameInternal} numberOfLines={2}>
                    {item.title || item.name}
                  </Text>
                  <Text style={styles.productPriceInternal}>
                    {formatPrice(item.price)}
                  </Text>
                  {/* Không hiển thị status và createdAt */}
                </View>
              </TouchableOpacity>
            )}
            numColumns={2}
            contentContainerStyle={styles.listContentContainer}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#323660"]}
                tintColor="#323660"
              />
            }
          />
        )}
      </View>

      {loading && sellerData.products.length > 0 && (
        <View style={styles.overlayLoading}>
          <ActivityIndicator size="large" color="#323660" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sellerInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  verifiedText: {
    fontSize: 14,
    color: "#2E7D32",
    marginLeft: 5,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 0,
    marginBottom: 15,
    marginLeft: 5,
  },
  emptyProductsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyProductsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
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
    color: "#333",
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
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#323660",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  // --- Styles for the internal Product Card ---
  productCardInternal: {
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: productItemWidth, // Sử dụng kích thước đã tính toán
    position: "relative",
  },
  productImageInternal: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imagePlaceholderInternal: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfoInternal: {
    padding: 10,
  },
  productNameInternal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productPriceInternal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#27AE60",
    marginBottom: 4,
  },
});

export default SellerProfileScreen;

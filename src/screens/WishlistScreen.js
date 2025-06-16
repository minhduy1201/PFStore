import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator, // Để hiển thị trạng thái tải
  ScrollView, // Giữ lại ScrollView nếu bạn muốn
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native"; // Cần thiết cho navigation

import { deleteWishlist, getWishlistByUser } from "../servers/WishlistService"; // Đảm bảo đường dẫn đúng
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const numColumns = 2; // Số cột
const horizontalPadding = 16; // Padding ngang của container
const cardMargin = 10; // Khoảng cách giữa các thẻ sản phẩm
const cardWidth =
  (width - horizontalPadding * 2 - cardMargin * (numColumns - 1)) / numColumns;

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getWishlistByUser();
        if (res && Array.isArray(res)) {
          setWishlist(res);
        } else {
          setWishlist([]);
          console.warn("API trả về dữ liệu không hợp lệ cho wishlist:", res);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách wishlist:", err);
        setError("Không thể tải danh sách yêu thích của bạn.");
        Alert.alert("Lỗi", "Không lấy được danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();

    // Đăng ký listener để tải lại wishlist khi màn hình được focus
    const unsubscribe = navigation.addListener("focus", () => {
      loadWishlist();
    });

    return unsubscribe;
  }, [navigation]);

  //Xóa sản phẩm yêu thích
  const handleRemoveFromWishlist = async (wishlistId) => {
    Alert.alert(
      "Xóa",
      "Bạn có chắc muốn xóa sản phẩm khỏi danh sách yêu thích",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              const success = await deleteWishlist(wishlistId);
              if (success) {
                setWishlist((prevWishList) => {
                  const updatedList = prevWishList.filter(
                    (item) => item.wishlistId !== wishlistId
                  );
                  console.log("Mảng sau khi xóa", updatedList);
                  return updatedList;
                });
              } else {
                Alert.alert(
                  "Lỗi",
                  "Không thể xóa sản phẩm khỏi danh sách yêu thích."
                );
              }
            } catch (err) {
              console.error("Lỗi khi thực hiện xóa:", err);
              Alert.alert(
                "Lỗi",
                "Đã xảy ra lỗi khi xóa sản phẩm: " + (err.message || "")
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header cho trang Wishlist */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
      </View>

      {/* Hiển thị trạng thái tải, lỗi, hoặc danh sách */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : wishlist && wishlist.length > 0 ? (
        <ScrollView style={styles.section}>
          <View style={styles.productsGridContainer}>
            {wishlist.map((item, index) => {
              const prod = item.product; // Lấy đối tượng product từ item wishlist

              if (!prod) {
                // Kiểm tra nếu product bị null
                return (
                  <View
                    key={item.wishlistId || index}
                    style={styles.productCard}
                  >
                    <Text style={{ color: "red" }}>Sản phẩm không có sẵn.</Text>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={item.wishlistId?.toString() || index.toString()} // Key duy nhất
                  style={styles.productCard}
                  onPress={() =>
                    navigation.navigate("ProductDetail", {
                      productId: prod.productId,
                    })
                  }
                >
                  {prod.productImages && prod.productImages.length > 0 ? (
                    <Image
                      source={{ uri: prod.productImages[0].imageUrl }}
                      style={styles.productImage}
                    />
                  ) : (
                    // Hiển thị placeholder nếu không có hình ảnh
                    <View
                      style={[
                        styles.productImage,
                        {
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#e0e0e0",
                        },
                      ]}
                    >
                      <Ionicons name="image-outline" size={50} color="#aaa" />
                      <Text
                        style={{ fontSize: 10, color: "#888", marginTop: 5 }}
                      >
                        Không ảnh
                      </Text>
                    </View>
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{prod.title}</Text>
                    <Text style={styles.productPrice}>
                      {prod.price?.toLocaleString("vi-VN")} VNĐ
                    </Text>
                    {/* Nút xóa khỏi wishlist */}
                    <TouchableOpacity
                      style={styles.wishlistButton}
                      onPress={() => handleRemoveFromWishlist(item.wishlistId)}
                    >
                      <AntDesign name="delete" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        // Hiển thị khi danh sách wishlist trống
        <View style={styles.emptyWishlistContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color="lightgray" />
          <Text style={styles.emptyWishlistText}>
            Danh sách yêu thích của bạn đang trống.
          </Text>
          <Text style={styles.emptyWishlistSubText}>
            Hãy khám phá thêm các sản phẩm!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50, // Điều chỉnh nếu cần
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
  section: {
    marginBottom: 15, // Khoảng cách dưới cùng của phần sản phẩm
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20, // Kích thước tiêu đề trang lớn hơn
    fontWeight: "700",
    color: "#333",
  },
  // Các style cho trạng thái tải, lỗi, rỗng
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    color: "red",
    marginTop: 20,
    fontSize: 16,
  },
  emptyWishlistContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyWishlistText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginTop: 15,
  },
  emptyWishlistSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },

  productsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    width: cardWidth,
    marginBottom: 10,
    padding: 8,
    height: 220, // Đảm bảo đủ không gian cho ảnh và text
    alignItems: "flex-start",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative", // Để định vị nút trái tim nếu có
  },
  productImage: {
    width: "100%",
    height: cardWidth - 16,
    borderRadius: 10,
    backgroundColor: "#eee", // Màu nền cho ảnh nếu không có ảnh hoặc đang tải
    marginBottom: 6,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 1,
    color: "#333",
    lineHeight: 18,
    maxHeight: 36, // Giới hạn 2 dòng
    overflow: "hidden",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 1,
  },
  wishlistButton: {
    position: "absolute",
    top: 20,
    right: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
  },
});

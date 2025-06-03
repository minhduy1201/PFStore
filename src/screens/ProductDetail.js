import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator, // Để hiển thị trạng thái tải
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper"; // Để tạo carousel ảnh
import { getProductById } from "../servers/ProductService"; // Import hàm mới

const { width } = Dimensions.get("window");
//số dòng tối đa cho mô tả
const MAX_DESCRIPTION_LINES = 3;

export default function ProductDetail({ route, navigation }) {
  const { productId } = route.params; // Lấy productId từ tham số điều hướng
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const loadProductDetail = async () => {
      try {
        setLoading(true);
        const res = await getProductById(productId);
        setProduct(res);
      } catch (err) {
        console.error("Failed to load product detail:", err);
        setError(true);
        Alert.alert(
          "Lỗi",
          "Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductDetail();
    } else {
      Alert.alert("Lỗi", "Không tìm thấy ID sản phẩm.");
      navigation.goBack(); // Quay lại nếu không có ID sản phẩm
    }
  }, [productId]); // Chạy lại khi productId thay đổi

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text>Không thể hiển thị chi tiết sản phẩm.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hàm để định dạng giá
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Chuẩn bị các dòng mô tả
  const descriptionLines = product.description
    ? product.description.split(".").filter(Boolean)
    : [];

  // Xác định xem có cần hiển thị nút "Xem thêm" hay không
  const needsReadMore = descriptionLines.length > MAX_DESCRIPTION_LINES;

  // Các dòng mô tả sẽ hiển thị
  const displayedDescriptionLines = showFullDescription
    ? descriptionLines
    : descriptionLines.slice(0, MAX_DESCRIPTION_LINES);

  return (
    <ScrollView style={styles.container}>
      {/*Nút trở về */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Product Image Carousel */}
      {product.images && product.images.length > 0 ? (
        <Swiper
          style={styles.imageSwiper}
          height={width * 0.9} // Chiều cao ảnh gần bằng chiều rộng màn hình để tạo hình vuông
          showsButtons={false}
          dotStyle={styles.swiperDot}
          activeDotStyle={styles.swiperActiveDot}
        >
          {product.images.map((imageUri, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={{ uri: imageUri }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </Swiper>
      ) : (
        <Image
          source={require("../../assets/images/icon.png")} // Thêm ảnh placeholder nếu không có ảnh
          style={styles.productImagePlaceholder}
          resizeMode="contain"
        />
      )}

      <View style={styles.content}>
        {/* Tiêu đề và giá */}
        <View style={styles.priceTitleContainer}>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          {/* Nút chia sẻ nằm ở đây theo mockup ban đầu */}
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.productTitle}>{product.title}</Text>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          {displayedDescriptionLines.length > 0 ? (
            displayedDescriptionLines.map((line, index) => (
              <Text key={index} style={styles.descriptionText}>
                • {line.trim()}
              </Text>
            ))
          ) : (
            <Text style={styles.descriptionText}>Không có mô tả chi tiết.</Text>
          )}

          {needsReadMore && (
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreButtonText}>
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          )}

          {product.attributes && product.attributes.length > 0 && (
            <View style={styles.attributesContainer}>
              {product.attributes.map((attr, index) => (
                <Text key={index} style={styles.attributeText}>
                  • {attr.attributeName}: {attr.value}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Thông tin người bán */}
        {product.seller && (
          <TouchableOpacity style={styles.sellerContainer}>
            <Image
              source={require("../../assets/images/logo.jpg")} // Thay thế bằng ảnh đại diện người bán nếu có
              style={styles.sellerAvatar}
            />
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{product.seller.fullName}</Text>
                {product.seller.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#4CAF50"
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
              <View style={styles.sellerRating}>
                <Text style={styles.ratingText}>4.0</Text>{" "}
                {/* Hardcoded for now, ideal to fetch from API */}
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < 4 ? "star" : "star-outline"} // Assuming 4 stars for now
                    size={16}
                    color="#FFD700"
                  />
                ))}
                <Text style={styles.ratingText}>
                  {" "}
                  ({product.seller.productCount || 10} sản phẩm đã bán)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        )}

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Bình luận</Text>
          {/* Example comments - you'd map over actual comment data */}
          <View style={styles.commentItem}>
            {/* Nếu có avatar người comment, uncomment dòng dưới */}
            {/* <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.commentAvatar}
            /> */}
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>Tô Nhật</Text>
              <Text style={styles.commentText}>Kính này gọng gì vậy?</Text>
              <Text style={styles.commentTime}>11 giờ trước • Phản hồi</Text>
            </View>
          </View>
          <View style={styles.commentItem}>
            {/* <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.commentAvatar}
            /> */}
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>Tường An</Text>
              <Text style={styles.commentText}>
                Kính gọng kim loại, dẻo và bền lắm b
              </Text>
              <Text style={styles.commentTime}>10 giờ trước • Phản hồi</Text>
            </View>
          </View>

          {/* Comment input */}
          <View style={styles.commentInputContainer}>
            {/* <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.commentAvatar}
            /> */}
            <TextInput
              style={styles.commentTextInput}
              placeholder="Nhập bình luận..."
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 5,
  },
  shareButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 5,
  },
  imageSwiper: {
    // Height set in component
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productImagePlaceholder: {
    width: "100%",
    height: width * 0.9,
    backgroundColor: "#f0f0f0",
  },
  swiperDot: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  swiperActiveDot: {
    backgroundColor: "#007bff",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  priceTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e63946",
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  descriptionText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  // Style cho nút "Xem thêm"
  readMoreButton: {
    marginTop: 8,
    alignSelf: "flex-start", // Đảm bảo nút không kéo dài hết chiều ngang
  },
  readMoreButtonText: {
    color: "#007bff", // Màu xanh dương hoặc màu nhấn mạnh khác
    fontSize: 14,
    fontWeight: "bold",
  },
  attributesContainer: {
    marginTop: 10,
  },
  attributeText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  sellerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 5,
    color: "#333",
  },
  verifiedIcon: {
    // Styles for the checkmark icon
  },
  sellerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: "#777",
    marginRight: 5,
  },
  commentsSection: {
    marginBottom: 30,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    fontSize: 15,
  },
});

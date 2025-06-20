import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { getProductById } from "../servers/ProductService";
import { getUserId } from "../servers/AuthenticationService"; // Đảm bảo đúng đường dẫn
import {
  addWishlist,
  deleteWishlist,
  getWishlistByUser,
} from "../servers/WishlistService";
import { getCommentByProId } from "../servers/CommentService";

const { width } = Dimensions.get("window");

const MAX_DESCRIPTION_LINES = 3;

export default function ProductDetail({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [comment, setComment] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const loadProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProductById(productId);
      setProduct(res);

      //kiểm tra trạng thái của wishlist ban đầu
      const userId = await getUserId();

      if (userId) {
        try {
          const userWishlist = await getWishlistByUser();
          const foundInWishlist = userWishlist.some(
            (item) => item.product?.productId === productId
          );
          setIsFavorite(foundInWishlist);
        } catch (wishlistErr) {
          console.error("Không kiểm tra được wishlist ban đầu", wishlistErr);
        }
      }
    } catch (err) {
      console.error("Không tải được danh sách sản phẩm:", err);
      setError(true);
      Alert.alert("Lỗi", "Không thể tải chi tiết sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  //load lên chi tiết sản phẩm
  useEffect(() => {
    if (productId) {
      loadProductDetail();
    } else {
      Alert.alert("Lỗi", "Không tìm thấy ID sản phẩm.");
      navigation.goBack();
    }
  }, [productId, loadProductDetail, navigation]);

  //load lên bình luận sản phẩm
  useEffect(() => {
    const loadComments = async (productId) => {
      try {
        const data = await getCommentByProId(productId);
        if (data && Array.isArray(data)) {
          setComment(data);
        }
      } catch (error) {
        console.log("Không thể lấy được bình luận");
      }
    };
    loadComments();
  }, []);

  //Hàm xử lý thêm/ xóa yêu thích
  const handleToggleFavorite = async () => {
    const userId = await getUserId();
    if (!productId) {
      Alert.alert("Lỗi", "Không tìm thấy ID sản phẩm để thêm/xóa.");
      return;
    }
    if (favoriteLoading) {
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Nếu đã yêu thích, thì xóa
        const userWishlist = await getWishlistByUser();
        const itemToRemove = userWishlist.find(
          (item) => item.product?.productId === productId
        );

        if (itemToRemove && itemToRemove.wishlistId) {
          await deleteWishlist(itemToRemove.wishlistId);
          setIsFavorite(false);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy sản phẩm trong wishlist để xóa.");
        }
      } else {
        // Nếu chưa yêu thích, thì thêm
        await addWishlist(productId, userId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.log("Lỗi khi thay đổi trạng thái yêu thích:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

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

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const descriptionLines = product.description
    ? product.description.split(".").filter(Boolean)
    : [];

  const needsReadMore = descriptionLines.length > MAX_DESCRIPTION_LINES;

  const displayedDescriptionLines = showFullDescription
    ? descriptionLines
    : descriptionLines.slice(0, MAX_DESCRIPTION_LINES);

  return (
    <KeyboardAvoidingView
      style={styles.fullScreenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Product Image Carousel */}
        {/* Product Image Carousel */}
        {product.images && product.images.length > 0 ? (
          <Swiper
            style={styles.imageSwiper}
            height={width * 0.9}
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
            source={require("../../assets/images/icon.png")}
            style={styles.productImagePlaceholder}
            resizeMode="contain"
          />
        )}

        <View style={styles.content}>
          {/* Tiêu đề và giá */}
          <View style={styles.priceTitleContainer}>
            <Text style={styles.productPrice}>
              {formatPrice(product.price)}
            </Text>
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
              <Text style={styles.descriptionText}>
                Không có mô tả chi tiết.
              </Text>
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

            {product.productAttributes &&
              product.productAttributes.length > 0 && (
                <View style={styles.attributesContainer}>
                  {product.productAttributes.map((attr, index) => (
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
                source={require("../../assets/images/logo.jpg")}
                style={styles.sellerAvatar}
              />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>
                    {product.seller.fullName}
                  </Text>
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
                  <Text style={styles.ratingText}>4.0</Text>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < 4 ? "star" : "star-outline"}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    ({product.seller.productCount || 10} sản phẩm đã bán)
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          )}
          {/* Phần bình luận */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Bình luận</Text>
          
            {/* Comment input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentTextInput}
                placeholder="Nhập bình luận..."
                placeholderTextColor="#999"
              />
            </View>
          </View>
          {/* Đảm bảo có đủ padding ở cuối ScrollView để không bị che bởi thanh action */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Thanh action cố định ở dưới cùng */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          disabled={favoriteLoading}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "red" : "#666"}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.buttonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buttonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
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
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
  readMoreButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  readMoreButtonText: {
    color: "#007bff",
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
  bottomActionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#3a3f5a",
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#4c8bf5",
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

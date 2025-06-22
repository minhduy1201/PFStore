import React, { useEffect, useState, useCallback, useRef } from "react";
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Swiper from "react-native-swiper";
import { getProductById } from "../servers/ProductService";
import { getUserId } from "../servers/AuthenticationService";
import {
  addWishlist,
  deleteWishlist,
  getWishlistByUser,
} from "../servers/WishlistService";
import {
  addComment,
  deleteComment,
  getCommentByProId,
} from "../servers/CommentService";
import { addCart } from "../servers/CartService";

const { width } = Dimensions.get("window");

const MAX_DESCRIPTION_LINES = 3;

export default function ProductDetail({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  //danh sach binh luan
  const [comments, setComments] = useState([]);
  //nội dung bình luận
  const [commentInput, setCommentInput] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null); //lưu commentId của bình luận đang muốn trả lời
  const [replyToUserName, setReplyToUserName] = useState(""); //lưu username mà người dùng đang muốn trả lời
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // Lưu ID người dùng hiện tại
  const [loadingComments, setLoadingComments] = useState(false); // Thêm state loading cho comments

  const scrollViewRef = useRef(null);
  const commentInputRef = useRef(null);

  // Load user ID khi component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setCurrentUserId(id);
    };
    fetchUserId();
  }, []);

  const loadProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProductById(productId);
      setProduct(res);

      //kiểm tra trạng thái của wishlist ban đầu
      const userId = await getUserId();

      if (userId) {
        try {
          const userWishlist = await getWishlistByUser();
          const foundInWishlist = userWishlist.some(
            (item) => item.product?.productId === productId
          );
          setIsFavorite(foundInWishlist);
        } catch (wishlistErr) {
          console.error("Không kiểm tra được wishlist ban đầu", wishlistErr);
        }
      }
    } catch (err) {
      console.error("Không tải được danh sách sản phẩm:", err);
      setError(true);
      Alert.alert("Lỗi", "Không thể tải chi tiết sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  //load lên chi tiết sản phẩm
  useEffect(() => {
    if (productId) {
      loadProductDetail();
    } else {
      Alert.alert("Lỗi", "Không tìm thấy ID sản phẩm.");
      navigation.goBack();
    }
  }, [productId, loadProductDetail, navigation]);

  //tải lên danh sách bình luận
  const loadComments = useCallback(async () => {
    if (!productId) {
      console.log("Không có productId để tải bình luận.");
      return;
    }
    try {
      setLoadingComments(true); // Bắt đầu tải bình luận
      console.log(`Đang tải bình luận cho sản phẩm ID: ${productId}`);
      const data = await getCommentByProId(productId);
      if (data && Array.isArray(data)) {
        // Sắp xếp bình luận để đảm bảo bình luận cha hiển thị trước bình luận con
        // và các bình luận con hiển thị sau bình luận cha tương ứng.
        const sortedComments = [...data].sort((a, b) => {
          // Ưu tiên bình luận cha (parentcommentId === 0)
          if (a.parentcommentId === 0 && b.parentcommentId !== 0) return -1;
          if (a.parentcommentId !== 0 && b.parentcommentId === 0) return 1;

          // Nếu cùng là bình luận cha hoặc cùng là bình luận con của cùng một cha
          // Sắp xếp theo thời gian tạo
          if (a.parentcommentId === b.parentcommentId) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }

          // Xử lý trường hợp bình luận con của các cha khác nhau (nếu cần, nhưng thường thì không so sánh trực tiếp)
          // Hiện tại, logic filter ở render sẽ đảm bảo chỉ so sánh trong ngữ cảnh đúng.
          return 0;
        });
        setComments(sortedComments);
      }
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
      Alert.alert("Lỗi", "Không thể tải bình luận. Vui lòng thử lại sau.");
      setComments([]);
    } finally {
      setLoadingComments(false); // Kết thúc tải bình luận
    }
  }, [productId]);

  //tải lên danh sách bình luận
  useEffect(() => {
    if (productId) {
      loadComments();
    }
  }, [productId, loadComments]);

  // Hàm xử lý khi nhấn nút "Phản hồi"
  const handleReplyPress = useCallback((commentId, userName) => {
    setReplyToCommentId(commentId);
    setReplyToUserName(userName);
    // Tự động focus vào TextInput và cuộn xuống cuối
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
    if (scrollViewRef.current) {
      setTimeout(() => {
        // Dùng setTimeout để đảm bảo keyboard đã hiện lên và layout đã điều chỉnh
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 300); // Có thể điều chỉnh thời gian
    }
  }, []);

  // Hàm hủy trả lời
  const cancelReply = useCallback(() => {
    setReplyToCommentId(null);
    setReplyToUserName("");
    setCommentInput(""); // Xóa nội dung input khi hủy trả lời
  }, []);

  // Hàm xử lý thêm bình luận
  const handleAddComment = async () => {
    if (!commentInput.trim()) {
      Alert.alert("Bình luận", "Bình luận không được để trống");
      return;
    }
    const userId = await getUserId();
    if (!userId) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để bình luận.");
      return;
    }
    try {
      const parentId = replyToCommentId || 0;
      await addComment(productId, commentInput, parentId);
      Alert.alert("Thành công", "Bình luận của bạn đã được gửi.");
      setCommentInput(""); //đặt lại nội dung rỗng
      cancelReply(); // Hủy trạng thái trả lời
      loadComments(); // Tải lại bình luận để hiển thị cái mới
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể gửi bình luận. Vui lòng thử lại."
      );
    }
  };

  //Hàm xóa bình luận
  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      "Xóa",
      "Bạn có chắc muốn xóa bình luận",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              const success = await deleteComment(commentId);
              if (success) {
                setComments((prevComments) => {
                  const updatedList = prevComments.filter(
                    (item) =>
                      item.commentId !== commentId &&
                      item.parentcommentId !== commentId // Xóa cả bình luận con nếu có
                  );
                  Alert.alert("Đã xóa bình luận");
                  return updatedList;
                });
              } else {
                Alert.alert("Lỗi", "Không thể xóa bình luận.");
              }
            } catch (err) {
              console.error("Lỗi khi thực hiện xóa:", err);
              Alert.alert(
                "Lỗi",
                "Đã xảy ra lỗi khi xóa bình luận: " + (err.message || "")
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  //Hàm xử lý thêm/ xóa yêu thích
  const handleToggleFavorite = async () => {
    const userId = await getUserId();
    if (!productId) {
      Alert.alert("Lỗi", "Không tìm thấy ID sản phẩm để thêm/xóa.");
      return;
    }
    if (!userId) {
      Alert.alert(
        "Lỗi",
        "Vui lòng đăng nhập để thêm sản phẩm vào mục yêu thích."
      );
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
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  //hàm xử lý thêm vào giỏ hàng
  const handleAddCart = async () => {
    const quantity = 1;
    try {
      const data = await addCart(productId, quantity);
      success = data.success;
      if (success) {
        Alert.alert("Thành công", "Đi đến giỏ hàng", [
          { text: "Hủy", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("CartScreen");
            },
          },
        ]);
      }
      if (!success) {
        Alert.alert("Giỏ hàng", "Sản phẩm đã có sẵn trong giỏ hàng", [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đến giỏ hàng",
            onPress: () => {
              navigation.navigate("CartScreen");
            },
          },
        ]);
      }
    } catch (error) {
      console.log("Lỗi khi thêm vào giỏ hàng");
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
      // Điều chỉnh behavior và keyboardVerticalOffset cho phù hợp
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -50} // Điều chỉnh offset nếu cần trên Android
    >
      <ScrollView style={styles.container} ref={scrollViewRef}>
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
                // Đảm bảo mỗi dòng là một Text component
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
                    // Đảm bảo mỗi thuộc tính là một Text component
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
                source={{ uri: product.seller.avatarUrl }}
                style={styles.sellerAvatar}
              />
              <TouchableOpacity
                style={styles.sellerInfo}
                onPress={() =>
                  navigation.navigate("SellerProfile", {
                    sellerId: product.seller.userId,
                    sellerName: product.seller.fullName,
                  })
                }
              >
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
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          )}
          {/* Bình luận */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Bình luận</Text>
            <ScrollView
              style={styles.commentsScrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {loadingComments ? (
                <ActivityIndicator
                  size="small"
                  color="#007bff"
                  style={styles.loadingIndicator}
                />
              ) : comments.length === 0 ? (
                <Text style={styles.noCommentsText}>
                  Chưa có bình luận nào.
                </Text>
              ) : (
                comments
                  .filter((item) => item.parentcommentId === 0) // Lọc bình luận cha
                  .map((parentComment) => (
                    <View
                      key={parentComment.commentId}
                      style={styles.parentCommentWrapper}
                    >
                      {/* Bình luận cha */}
                      <View style={styles.commentRow}>
                        <Image
                          source={
                            parentComment.user?.avatarUrl
                              ? { uri: parentComment.user.avatarUrl }
                              : require("../../assets/images/icon.png")
                          }
                          style={styles.commentAvatar}
                        />
                        {/* Bong bóng nội dung bình luận cha */}
                        <View style={styles.commentContentWrapper}>
                          {/* Tên */}
                          <Text style={styles.commentAuthor}>
                            {parentComment.user?.fullName ||
                              "Người dùng ẩn danh"}
                          </Text>
                          {/* Nội dung cmt */}
                          <Text style={styles.commentContent}>
                            {parentComment.content}
                          </Text>
                          {/* Thời gian và nút Phản hồi */}
                          <View style={styles.commentActions}>
                            <Text style={styles.commentTimestamp}>
                              {parentComment.createdAt
                                ? new Date(
                                    parentComment.createdAt
                                  ).toLocaleString()
                                : "Không rõ thời gian"}
                            </Text>
                            {/* Nút Phản hồi */}
                            <TouchableOpacity
                              onPress={() =>
                                handleReplyPress(
                                  parentComment.commentId,
                                  parentComment.user?.fullName
                                )
                              }
                            >
                              <Text style={styles.actionButtonText}>
                                Phản hồi
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {/* Nút Xóa (chỉ hiển thị nếu là chủ bình luận) */}
                          {currentUserId === parentComment.userId && (
                            <TouchableOpacity
                              style={styles.deleteIconContainer}
                              onPress={() =>
                                handleDeleteComment(parentComment.commentId)
                              }
                            >
                              <Ionicons
                                name="trash-outline"
                                size={16}
                                color="#dc3545"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      {/* Trả lời (bình luận con trực tiếp) */}
                      {comments
                        .filter(
                          (childComment) =>
                            childComment.parentcommentId ===
                            parentComment.commentId
                        )
                        .map((replyComment) => (
                          <View
                            key={replyComment.commentId}
                            style={styles.replyCommentWrapper}
                          >
                            <Image
                              source={
                                replyComment.user?.avatarUrl
                                  ? { uri: replyComment.user.avatarUrl }
                                  : require("../../assets/images/icon.png")
                              }
                              style={styles.replyAvatar}
                            />
                            {/* Bong bóng nội dung bình luận con */}
                            <View style={styles.replyContentWrapper}>
                              <Text style={styles.commentAuthor}>
                                {replyComment.user?.fullName ||
                                  "Người dùng ẩn danh"}
                              </Text>
                              <Text style={styles.commentContent}>
                                {replyComment.content}
                              </Text>
                              <View style={styles.commentActions}>
                                <Text style={styles.commentTimestamp}>
                                  {replyComment.createdAt
                                    ? new Date(
                                        replyComment.createdAt
                                      ).toLocaleString()
                                    : "Không rõ thời gian"}
                                </Text>
                                {/* Nút Phản hồi (cho phép trả lời bình luận con, nhưng sẽ trả lời cha của nó) */}
                                {/* Logic này cần cân nhắc kỹ hơn nếu muốn trả lời bình luận con thành bình luận con của nó */}
                                <TouchableOpacity
                                  onPress={() =>
                                    handleReplyPress(
                                      parentComment.commentId, // Vẫn trả lời bình luận cha gốc
                                      replyComment.user?.fullName // Nhưng hiển thị tên người trả lời là người comment con
                                    )
                                  }
                                >
                                  <Text style={styles.actionButtonText}>
                                    Phản hồi
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              {/* Nút Xóa (chỉ hiển thị nếu là chủ bình luận) */}
                              {currentUserId === replyComment.userId && (
                                <TouchableOpacity
                                  style={styles.deleteIconContainer}
                                  onPress={() =>
                                    handleDeleteComment(replyComment.commentId)
                                  }
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={16}
                                    color="#dc3545"
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ))}
                    </View>
                  ))
              )}
            </ScrollView>
          </View>
          {/* Thêm bình luận */}
          <View style={styles.commentInputContainer}>
            {/* Conditional render for replying to message */}
            {replyToCommentId && (
              <View style={styles.replyingToContainer}>
                <Text style={styles.replyingToText}>
                  Đang trả lời: @{replyToUserName}
                </Text>
                <TouchableOpacity onPress={cancelReply}>
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            )}
            {/* Wrapper mới để TextInput và Button nằm ngang */}
            <View style={styles.commentInputRow}>
              <TextInput
                ref={commentInputRef}
                style={styles.commentTextInput}
                placeholder="Nhập bình luận..."
                placeholderTextColor="#999"
                value={commentInput}
                onChangeText={setCommentInput}
                multiline={true}
                maxLength={200}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.sendCommentButton}
              >
                <MaterialCommunityIcons
                  name="send-circle-outline"
                  size={32} // Tăng kích thước icon cho dễ nhìn hơn
                  color="#007bff"
                />
              </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddCart}
        >
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

  // ------------------------------
  // Comments Section Styles
  // ------------------------------
  commentsSection: {
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 0,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
    paddingHorizontal: 16,
  },
  commentsScrollView: {
    maxHeight: 300,
    paddingRight: 5,
  },
  loadingIndicator: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  noCommentsText: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: 10,
    paddingHorizontal: 16,
  },

  parentCommentWrapper: {
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  commentContentWrapper: {
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    position: "relative",
    paddingRight: 35,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
    color: "#333",
  },
  commentContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "flex-start",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "gray",
    marginRight: 15,
  },
  actionButtonText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 12,
  },

  deleteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 5,
  },

  replyCommentWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 50,
    marginBottom: 15,
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  replyContentWrapper: {
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    borderLeftWidth: 3,
    borderLeftColor: "#007bff",
    position: "relative",
    paddingRight: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    marginTop: 10,
  },

  commentInputContainer: {
    flexDirection: "column", // Đổi thành column để `replyingToContainer` nằm trên
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f7ff",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  replyingToText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 13,
  },
  // Thêm style mới để bọc TextInput và nút gửi
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  commentTextInput: {
    flex: 1, // Để TextInput chiếm hết không gian còn lại
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    minHeight: 45,
    maxHeight: 100,
    // Không cần paddingRight âm nữa vì nút đã ở ngoài flex
  },
  sendCommentButton: {
    marginLeft: 10, // Khoảng cách giữa TextInput và nút gửi
    padding: 5,
    justifyContent: "center", // Căn giữa icon trong nút
    alignItems: "center", // Căn giữa icon trong nút
    height: 45, // Đảm bảo chiều cao tương đương với TextInput
  },
});

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Button,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Component con để hiển thị một bình luận/phản hồi
const CommentItem = ({ comment, onReplyPress, isReply = false }) => (
  <View
    style={[styles.commentItemContainer, isReply && styles.replyItemContainer]}
  >
    <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
    <View style={styles.commentContentWrapper}>
      <View style={styles.commentBubble}>
        <Text style={styles.commentUserName}>{comment.userName}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
      </View>
      {!isReply && (
        <TouchableOpacity
          onPress={() => onReplyPress(comment.id)}
          style={styles.replyButton}
        >
          <Text style={styles.replyButtonText}>Phản hồi</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const ProductDetail = ({ route }) => {
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [product, setProduct] = useState({
    name: "Kính mắt Chanel nữ authentic",
    price: 170000,
    image:
      "https://via.placeholder.com/400x220/f0f0f0/333333?text=Product+Image",
    description: [
      "Kính còn khoảng 95%, không trầy xước.",
      "Form kính chuẩn, đeo nhẹ mặt.",
      "Tròng tốt, không mờ hay loá.",
      "Full hộp + khăn lau kính đi kèm.",
    ],
    rating: 4.0,
    seller: {
      name: "Tường An",
      avatar:
        "https://via.placeholder.com/40x40/f0f0f0/333333?text=SellerAvatar",
    },
    comments: [
      {
        id: 1,
        userName: "Tô Nhật",
        userAvatar: "https://via.placeholder.com/40x40/f0f0f0/333333?text=TN",
        content: "Kính này gọng gì vậy?",
        replies: [
          {
            id: 11,
            userName: "Tường An",
            userAvatar:
              "https://via.placeholder.com/40x40/f0f0f0/333333?text=TA",
            content: "Kính gọng kim loại, dẻo và bền lắm b",
          },
        ],
      },
      {
        id: 2,
        userName: "An",
        userAvatar: "https://via.placeholder.com/40x40/f0f0f0/333333?text=An",
        content: "Còn hộp không ạ?",
        replies: [],
      },
      {
        id: 3,
        userName: "Minh",
        userAvatar: "https://via.placeholder.com/40x40/f0f0f0/333333?text=M",
        content: "Đã mua, kính rất đẹp!",
        replies: [],
      },
      {
        id: 4,
        userName: "Lan",
        userAvatar: "https://via.placeholder.com/40x40/f0f0f0/333333?text=L",
        content: "Có ship COD không shop?",
        replies: [
          {
            id: 41,
            userName: "Tường An",
            userAvatar:
              "https://via.placeholder.com/40x40/f0f0f0/333333?text=TA",
            content: "Dạ có ạ!",
          },
        ],
      },
    ],
  });

  const handleReplyPress = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyText("");
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 100);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newComment = {
      id: Math.random().toString(),
      userName: "Người dùng hiện tại",
      userAvatar: "https://via.placeholder.com/40x40/f0f0f0/333333?text=You",
      content: replyText.trim(),
    };

    setProduct((prevProduct) => {
      const updatedComments = prevProduct.comments.map((comment) => {
        if (comment.id === replyingToCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, newComment],
          };
        }
        return comment;
      });
      return { ...prevProduct, comments: updatedComments };
    });

    setReplyText("");
    setReplyingToCommentId(null);
    Keyboard.dismiss();
  };

  const renderDescription = () =>
    product.description.map((line, index) => (
      <Text key={index} style={styles.descriptionLine}>
        • {line}
      </Text>
    ));

  const renderCommentAndReplies = ({ item: comment }) => (
    <View>
      <CommentItem comment={comment} onReplyPress={handleReplyPress} />
      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply={true} />
      ))}
      {replyingToCommentId === comment.id && (
        <View style={styles.replyInputContainer}>
          <TextInput
            ref={replyInputRef}
            style={styles.replyTextInput}
            placeholder={`Trả lời ${comment.userName}...`}
            value={replyText}
            onChangeText={setReplyText}
            onSubmitEditing={handleSendReply}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSendReply}>
            <MaterialIcons name="send" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    // KeyboardAvoidingView bao bọc tất cả để đẩy nội dung lên khi bàn phím hiện
    <KeyboardAvoidingView
      style={styles.fullScreenContainer} // Đặt flex: 1 ở đây
      behavior={Platform.OS ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* ScrollView chứa tất cả nội dung có thể cuộn */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer} // Đảm bảo paddingBottom
        keyboardShouldPersistTaps="handled"
      >
        {/* Phần hình ảnh */}
        <Image source={{ uri: product.image }} style={styles.productImage} />

        {/* Giá + Tên */}
        <View style={styles.productInfo}>
          <Text style={styles.price}>{product.price.toLocaleString()}đ</Text>
          <Text style={styles.title}>{product.name}</Text>
        </View>

        {/* Mô tả */}
        <View style={styles.descriptionBox}>{renderDescription()}</View>

        {/* Thông tin người bán */}
        <View style={styles.sellerBox}>
          <Image
            source={{ uri: product.seller.avatar }}
            style={styles.avatar}
          />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{product.seller.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <FontAwesome name="star" size={16} color="#f5a623" />
              <Button
                title="Xem đánh giá"
                style={{ color: "#007bff", marginLeft: 10 }}
              ></Button>
            </View>
          </View>
        </View>

        {/* Bình luận */}
        <View style={styles.commentSection}>
          <Text style={styles.commentSectionTitle}>Bình luận</Text>
          <View style={styles.commentListContainer}>
            <FlatList
              data={product.comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCommentAndReplies}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        <View style={styles.mainCommentInputRowContainer}>
          <View style={styles.mainCommentInputRow}>
            <TextInput
              placeholder="Nhập bình luận..."
              style={styles.mainCommentInput}
            />
            <TouchableOpacity>
              <MaterialIcons name="send" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Thanh hành động cố định ở cuối màn hình */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"} // Biểu tượng trái tim đặc/rỗng
            size={24}
            color={isFavorite ? "red" : "#333"} // Màu khi đã yêu thích
          />
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
};

export default ProductDetail;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1, // Chiếm toàn bộ màn hình
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1, // ScrollView cũng cần flex: 1 để tự cuộn
  },
  scrollViewContentContainer: {
    paddingBottom: 80, // Điều chỉnh paddingBottom = chiều cao của bottomActionBar + khoảng trống
  },
  productImage: { width: "100%", height: 220, resizeMode: "cover" },
  productInfo: { padding: 15 },
  price: { fontSize: 22, fontWeight: "bold", color: "#2e5bff" },
  title: { fontSize: 16, fontWeight: "600", marginTop: 5 },
  descriptionBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  descriptionLine: { fontSize: 14, marginBottom: 5 },
  sellerBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  sellerInfo: { marginLeft: 10 },
  sellerName: { fontWeight: "600", fontSize: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  ratingText: { marginRight: 5 },
  commentSection: { paddingHorizontal: 15, marginTop: 10 },
  commentSectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  commentListContainer: {
    maxHeight: 300,
    overflow: "hidden",
    paddingBottom: 10,
  },

  // STYLES CHO BÌNH LUẬN VÀ PHẢN HỒI (giữ nguyên từ trước)
  commentItemContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  replyItemContainer: {
    marginLeft: 40,
    marginTop: 5,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginTop: 5,
  },
  commentContentWrapper: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#f0f2f5",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 5,
    alignSelf: "flex-start",
    maxWidth: "90%",
  },
  commentUserName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
  },
  replyButton: {
    marginLeft: 10,
  },
  replyButtonText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 40,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  replyTextInput: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 8 : 5,
    fontSize: 14,
  },

  // STYLES MỚI CHO THANH HÀNH ĐỘNG CỐ ĐỊNH Ở DƯỚI ĐÁY
  bottomActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", // Giãn đều các phần tử
    position: "absolute", // Quan trọng: Đặt vị trí tuyệt đối
    bottom: 0, // Dính vào đáy màn hình
    left: 0,
    right: 0,
    backgroundColor: "#fff", // Màu nền cho thanh hành động
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    height: 80, // Chiều cao cố định của thanh hành động
    shadowColor: "#000", // Thêm shadow cho đẹp hơn
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5, // Elevation cho Android
    paddingBottom: 10,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5", // Màu nền nhẹ cho nút yêu thích
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addToCartButton: {
    flex: 1, // Chiếm không gian còn lại
    backgroundColor: "#323660", // Màu nền theo hình ảnh
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10, // Khoảng cách giữa 2 nút
  },
  buyNowButton: {
    flex: 1, // Chiếm không gian còn lại
    backgroundColor: "#4472C4", // Màu nền theo hình ảnh
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mainCommentInputRowContainer: {
    bottom: 5,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  mainCommentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  mainCommentInput: {
    flex: 1,
    paddingVertical: 10,
  },
});

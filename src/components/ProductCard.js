import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProductCard = ({ product, onPress, onEdit, onDelete }) => {
  const formatPrice = (price) =>
    price.toLocaleString("vi-VN") + "₫";

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product.productId)}>
      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onEdit(product.productId)} style={styles.iconWrapper}>
          <MaterialCommunityIcons name="pencil" size={18} color="#2D9CDB" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(product.productId)} style={styles.iconWrapper}>
          <MaterialCommunityIcons name="delete" size={18} color="#EB5757" />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      {product.images ? (
        <Image source={{ uri: product.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: "#aaa" }}>No Image</Text>
        </View>
      )}

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
       <View style={styles.statusRow}>
  <Text
    style={[
      styles.status,
      product.status === "approved" ? styles.approved : styles.pending,
    ]}
  >
    {product.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
  </Text>
  {product.createdAt && (
    <Text style={styles.dateText}>
      {new Date(product.createdAt).toLocaleDateString("vi-VN")}
    </Text>
  )}
</View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    maxWidth: "46%", // để còn space 2 cột
    position: "relative",
  },
  statusRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 4,
},
dateText: {
  fontSize: 12,
  color: "#888",
},

  actionsContainer: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 6,
    flexDirection: "row",
    padding: 2,
  },
  iconWrapper: {
    padding: 4,
  },
  image: {
    width: "100%",
    height: 150,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#27AE60",
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  approved: {
    color: "#219653",
  },
  pending: {
    color: "#F2994A",
  },
});

export default ProductCard;

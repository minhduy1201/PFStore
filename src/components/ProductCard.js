import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import icon

const ProductCard = ({ product, onPress, onEdit, onDelete }) => {
  // Thêm onEdit, onDelete props
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "vnđ";
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        {/* Thêm trạng thái sản phẩm nếu có */}
        {product.status && (
          <Text style={styles.productStatus}>Trạng thái: {product.status}</Text>
        )}
      </View>
      {/* Các nút thao tác */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(product)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#4472C4" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(product.id)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    maxWidth: "45%", // (100% - 4 * margin) / 2
    position: "relative", // Để các nút actions nằm trên card
  },
  productImage: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#323660",
    fontWeight: "bold",
    marginBottom: 5,
  },
  productStatus: {
    fontSize: 12,
    color: "#666",
  },
  actionsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 5,
    padding: 2,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
});

export default ProductCard;

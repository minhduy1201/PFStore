import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList, 
  Image,
  TouchableOpacity,
  ActivityIndicator, 
  Alert, 
  Dimensions, 
  Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { getProductByCatId } from "../servers/ProductService"; 
import { useNavigation } from "@react-navigation/native"; 

const { width } = Dimensions.get("window");
const numColumns = 2; // Số cột hiển thị sản phẩm

export default function ProductByCategory({ route }) {
  const navigation = useNavigation(); 
  const { categoryId, categoryName } = route.params || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProdByCat = async () => {
      try {
        setLoading(true);
        setError(false); 
        const res = await getProductByCatId(categoryId);
        if (res) { 
            setProducts(res);
        } else {
            setProducts([]); 
        }
      } catch (err) {
        console.error("Failed to load products by category:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProdByCat();
  }, [categoryId, navigation]); 

  //định dạng lại giá
  const formatPrice = (price) => {
    if (typeof price !== 'number') return `${price} VND`; 
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Hàm render từng item sản phẩm cho FlatList
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { productId: item.productId })}
    >
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0] }}
          style={styles.productImage}
          resizeMode="cover" // cover để đảm bảo hình ảnh đầy đủ card
        />
      ) : (
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.productImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.productTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.productPriceText}>{formatPrice(item.price)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Không thể tải sản phẩm. Vui lòng kiểm tra kết nối hoặc thử lại.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header của màn hình */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || "Sản phẩm theo danh mục"}</Text>
      </View>

      {/* Hiển thị sản phẩm nếu có, ngược lại hiển thị thông báo */}
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.productId.toString()} // Sử dụng productId làm key
          numColumns={numColumns} 
          columnWrapperStyle={styles.row} // Để căn chỉnh các cột
          contentContainerStyle={styles.productList} // Padding cho FlatList
          showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        />
      ) : (
        <View style={styles.centered}>
          <Text>Không có sản phẩm nào trong danh mục "{categoryName || 'này'}".</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Màu nền nhẹ nhàng
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 50 : 60, // Điều chỉnh padding trên đầu cho phù hợp với status bar
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
    padding: 5, // Tăng diện tích chạm cho nút
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  productList: {
    paddingHorizontal: 8, // Khoảng cách từ cạnh màn hình
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between", // Căn đều các sản phẩm trong một hàng
    marginBottom: 10, // Khoảng cách giữa các hàng sản phẩm
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    // Tính toán chiều rộng cho mỗi card để có 2 cột đều nhau
    // (width - (2 * paddingHorizontal) - (số cột - 1) * marginHorizontal_giua_cac_cot) / số cột
    width: (width - 16 - 10) / numColumns, // (width - 2*8 paddingFlatlist - 2*5 marginCard) / 2
    marginBottom: 12,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden", // Đảm bảo hình ảnh không tràn ra ngoài bo tròn
    marginHorizontal: 5, // Khoảng cách giữa các card trong cùng một hàng
  },
  productImage: {
    width: "100%",
    height: 180, // Chiều cao cố định cho ảnh sản phẩm, bạn có thể điều chỉnh
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#f0f0f0", // Màu nền khi ảnh chưa load
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    paddingHorizontal: 10,
    lineHeight: 22, // Tăng lineHeight để văn bản không bị dính
  },
  productPriceText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#e63946", // Màu đỏ cho giá
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
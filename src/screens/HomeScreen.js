import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GetCategories,
  getProducts,
  GetProducts,
} from "../servers/ProductService";

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("current_user");
        if (!token || !user) {
          navigation.replace("Login");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể xác thực phiên đăng nhập");
        navigation.replace("Login");
      }
    };

    checkLoginStatus();
  }, [navigation]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await GetCategories();
        if (res && Array.isArray(res)) {
          setCategories(res);
        } else {
          Alert.alert("Lỗi", "Không thể tải danh mục sản phẩm");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải danh mục");
        console.log("Load category error:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();
        if (res && Array.isArray(res)) {
          setProducts(res);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải sản phẩm");
        console.log("Load product:", error);
      }
    };
    loadProducts();
  }, []);

  // Xử lý khi nhấn tìm kiếm
  const handleSearch = () => {
    navigation.navigate("SearchProducts", { keyword }); // Chuyển sang màn hình SearchProducts với từ khóa
  };

  return (
    <ScrollView style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm"
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Promotion Banner */}
      <View style={styles.banner}>
        <Image
          source={require("../../assets/images/banner.png")}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh Mục</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.categoryId.toString()}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("ProductByCat", {
                  categoryId: cat.categoryId,
                  categoryName: cat.name,
                })
              }
            >
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
        </View>

        {/* This is the new container for vertical, two-column product display */}
        <View style={styles.productsGridContainer}>
          {products.map((prod, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  productId: prod.productId,
                })
              }
              activeOpacity={0.85}
            >
              {prod.productImages && prod.productImages.length > 0 ? (
                <Image
                  source={{ uri: prod.productImages[0].imageUrl }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.productImagePlaceholder}>
                  <Text style={{ color: "#aaa" }}>No Image</Text>
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{prod.title}</Text>
                <Text style={styles.productPrice}>
                  {prod.price.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f6fa",
    borderRadius: 24,
    alignItems: "center",
    paddingHorizontal: 10,
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 15,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  searchButton: {
    backgroundColor: "#323660",
    borderRadius: 20,
    padding: 8,
    marginLeft: 6,
  },
  banner: {
    marginVertical: 12,
    alignItems: "center",
  },
  bannerImage: {
    width: "96%",
    height: 120,
    borderRadius: 14,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoriesScrollContainer: {
    paddingVertical: 5,
  },
  categoryItem: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#323660",
    marginRight: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  productsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    width: "48%", // Đảm bảo 2 cột đều nhau
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  productImagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfo: {
    padding: 12,
    alignItems: "flex-start",
  },
  productTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
    minHeight: 36,
  },
  productPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e63946",
    marginTop: 2,
  },
});

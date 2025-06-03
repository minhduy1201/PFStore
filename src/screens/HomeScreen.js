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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetCategories, getProducts } from "../servers/ProductService";

const { width } = Dimensions.get("window");
// Calculate card width for two columns with spacing and padding
const cardWidth = (width - 16 * 2 - 10) / 2; // (screenWidth - horizontalPadding * 2 - spaceBetweenCards) / 2

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        if (!token || !user) {
          navigation.replace("Login");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể xác thực phiên đăng nhập");
        navigation.replace("Login");
      }
    };

    checkLoginStatus();
  }, []);

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

  return (
    <ScrollView style={styles.container}>
      {/* Header (Search Bar) */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm sản phẩm" />
        <Ionicons name="notifications-outline" size={24} color="black" />
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
            >
              {prod.productImages && prod.productImages.length > 0 && (
                <Image
                  source={{ uri: prod.productImages[0].imageUrl }}
                  style={styles.productImage}
                />
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
    paddingHorizontal: 16,
    paddingTop: 50,
    marginBottom: 55,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  banner: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  categoriesScrollContainer: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  categoryItem: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

  // --- New Styles for Products Grid ---
  productsGridContainer: {
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Allow items to wrap to the next line
    justifyContent: "space-between", // Distribute space between items
  },
  productCard: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    width: cardWidth, // Use the calculated cardWidth
    marginBottom: 10, // Space between rows
    padding: 8,
    height: 220, // Adjusted height to accommodate image and text better
    alignItems: "flex-start",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: cardWidth - 16, // Keep aspect ratio, subtract padding
    borderRadius: 10,
    backgroundColor: "#eee",
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
    // Add these two lines to limit text to two lines
    maxHeight: 36, // Approx height for 2 lines (18 * 2)
    overflow: "hidden",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 1,
  },
  logo: {
    width: 32,
    height: 32,
  },
});

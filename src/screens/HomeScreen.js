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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { GetCategories } from "../servers/ProductService";

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // lưu token riêng nếu cần
        const user = await AsyncStorage.getItem("user");
        if (!token || !user) {
          // Nếu không có token hoặc user thì quay lại Login
          navigation.replace("Login");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể xác thực phiên đăng nhập");
        navigation.replace("Login");
      }
    };

    checkLoginStatus();
  }, []);

  // Load danh mục
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
  return (
    <ScrollView style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm sản phẩm" />
      </View>

      {/* Banner khuyến mãi */}
      <View style={styles.banner}>
        <Image
          source={require("../../assets/images/banner.png")}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Danh Mục */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh Mục</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categories}>
            {categories.map((cat, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Mới Nhất */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mới Nhất</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.productCard}>
              <Image
                source={require("../../assets/images/demo.jpg")} // Đổi ảnh
                style={styles.productImage}
              />
              <Text style={styles.productTitle}>Sản phẩm {index + 1}</Text>
              <Text style={styles.productPrice}>160.000đ</Text>
            </View>
          ))}
        </ScrollView>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
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
  },
  section: {
    marginBottom: 20,
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
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  productCard: {
    width: 120,
    marginRight: 16,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  productTitle: {
    marginTop: 5,
    fontSize: 14,
  },
  productPrice: {
    fontWeight: "bold",
    marginTop: 2,
  },
  logo: {
    width: 32,
    height: 32,
  },
});

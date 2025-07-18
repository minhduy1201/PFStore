import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetCategories, getProducts } from "../servers/ProductService";
import ProductCard from "../components/ProductCard";
import { BRANDS } from '../screens/CreatePostScreen';

export default function SearchProductsScreen({ route, navigation }) {
  const { keyword } = route.params; // Nhận từ khóa tìm kiếm từ HomeScreen
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState(BRANDS);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    // Tìm kiếm sản phẩm khi màn hình được render
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result) {
          setProducts(result);
        }
      } catch (error) {
        setError("Không thể tìm thấy sản phẩm. Vui lòng thử lại.");
        console.error("Lỗi khi tìm kiếm sản phẩm", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (keyword) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [keyword, products]);

  // Hàm xử lý khi người dùng nhấn vào một sản phẩm (xem chi tiết)
  const handleProductPress = (product) => {
    Alert.alert("Xem chi tiết", `Bạn đã chọn xem chi tiết: ${product.name}`);
    // navigation.navigate('ProductDetail', { productId: product.id });
  };

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

  // Xử lý mở/đóng filter popupAdd commentMore actions.
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  // Xử lý nút thiết lập lại
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  // Xử lý áp dụng lọc
  const applyFilter = () => {

    let filtered = products.filter(product =>
      product.title.toLowerCase().includes(keyword.toLowerCase()) // Giữ lại từ khóa tìm kiếm
    );

    // Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));

    }

    // Lọc theo danh mục
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    // Lọc theo giá
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered); // Cập nhật lại danh sách sản phẩm đã lọc
    setShowFilter(false); // Đóng popup lọc sau khi áp dụng
  };

  // Hàm để toggle chọn thương hiệu
  const toggleBrandSelection = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand)); // Bỏ chọn nếu đã chọn
    } else {
      setSelectedBrands([...selectedBrands, brand]); // Thêm vào danh sách đã chọn
    }
  };

  // Xử lý toggle chọn danh mục
  const toggleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category)); // Bỏ chọn nếu đã chọn
    } else {
      setSelectedCategories([...selectedCategories, category]); // Thêm vào danh sách đã chọn
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kết quả tìm kiếm</Text>
        <TouchableOpacity onPress={toggleFilter}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Hiển thị sản phẩm tìm thấy */}
      {filteredProducts.length > 0 ? (
        <View style={styles.productsGridContainer}>
          {filteredProducts.map((prod, index) => (
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
      ) : (
        <Text>Không có sản phẩm nào phù hợp với từ khóa "{keyword}"</Text>
      )}

      {/* Popup lọc sản phẩm */}
      {showFilter && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showFilter}
          onRequestClose={toggleFilter}
        >
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={styles.overlay}></View>
          </TouchableWithoutFeedback>
          <View style={styles.filterContainer}>
            <View style={styles.filterContent}>
              <Text style={styles.filterTitle}>Lọc Sản Phẩm</Text>

              {/* Thương hiệu */}
              <Text style={styles.filterLabel}>Thương hiệu</Text>
              <View style={styles.categories}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScrollContainer}
                >
                  {brands.map((bra) => (
                    <TouchableOpacity
                      key={bra.value}
                      style={[
                        styles.categoryItem,

                        selectedBrands.includes(bra.value) && styles.selectedCategory,
                      ]}
                      onPress={() => toggleBrandSelection(bra.value)}
                    >
                      <Text style={styles.categoryText}>{bra.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Danh mục */}
              <Text style={styles.filterLabel}>Danh Mục</Text>
              <View style={styles.categories}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScrollContainer}
                >
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.categoryItem,
                        selectedCategories.includes(category.name) &&
                          styles.selectedCategory,
                      ]}
                      onPress={() => toggleCategorySelection(category.name)}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Giá */}
              <Text style={styles.filterLabel}>Giá</Text>
              <View style={styles.priceContainer}>
                <TextInput
                  style={styles.filterInput}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  placeholder="Giá tối thiểu"
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.filterInput}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="Giá tối đa"
                  keyboardType="numeric"
                />
              </View>

              {/* Nút thiết lập lại và áp dụng */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={resetFilters}
                  style={styles.buttonReset}
                >
                  <Text style={styles.buttonText}>Thiết lập lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyFilter}
                  style={styles.buttonApply}
                >
                  <Text style={styles.buttonText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  categoriesScrollContainer: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
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
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e63946",
    marginTop: 2,
  },
  logo: {
    width: 32,
    height: 32,
  },

  // Thêm style cho phần mới

  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  filterContent: {
    padding: 10,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: "#4CAF50",
  },
  selectedCategory: {
    backgroundColor: "#4CAF50",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonReset: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  buttonApply: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  listContentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});

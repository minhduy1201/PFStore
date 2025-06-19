import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetCategories, getProducts, GetProducts } from '../servers/ProductService';

export default function HomeScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

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
  }, [categories, navigation]);

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

  // Xử lý mở/đóng filter popupAdd commentMore actions
    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    
    // Xử lý nút thiết lập lại
    const resetFilters = () => {
      setSelectedBrands([]);
      setSelectedSizes([]);
      setMinPrice('');
      setMaxPrice('');
    };
    
    
    // Xử lý áp dụng lọc
    const applyFilter = () => {
      // lọc sản phẩm theo các lựa chọn đã chọn
      console.log('Applied Filters:', { selectedBrands, selectedSizes, minPrice, maxPrice });
      setShowFilter(false);
    };

    // Hàm để toggle chọn thương hiệu
    const toggleBrandSelection = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand)); // Bỏ chọn nếu đã chọn
        } else {
            setSelectedBrands([...selectedBrands, brand]); // Thêm vào danh sách đã chọn
        }
    };
    
    // Hàm để toggle chọn size
    const toggleSizeSelection = (size) => {
          if (selectedSizes.includes(size)) {
              setSelectedSizes(selectedSizes.filter(s => s !== size));  // Bỏ chọn size nếu đã chọn
          } else {
              setSelectedSizes([...selectedSizes, size]);  // Thêm size vào danh sách đã chọn
          }
      };
  
  return (
    <ScrollView style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.header}>
  <Image
    source={require('../../assets/images/logo.jpg')}
    style={styles.logo}
    resizeMode="contain"
  />
  <TextInput style={styles.searchInput} placeholder="Tìm kiếm sản phẩm" />
  <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
  <TouchableOpacity onPress={toggleFilter}>
    <Ionicons name="filter" size={24} color="black" />
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

    {/* Popup lọc sản phẩm */}
    {showFilter && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showFilter}
          onRequestClose={toggleFilter}>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={styles.overlay}></View>
          </TouchableWithoutFeedback>
          <View style={styles.filterContainer}>
            <View style={styles.filterContent}>
                <Text style={styles.filterTitle}>Lọc Sản Phẩm</Text>

                {/* Thương hiệu */}
                <Text style={styles.filterLabel}>Thương hiệu</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.categories}>
                                    {categories.map((cat, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.categoryItem, selectedBrands.includes(cat.name) && styles.selectedCategory]}
                                            onPress={() => toggleBrandSelection(cat.name)}>
                                            <Text style={styles.categoryText}>{cat.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                {/* Size */}
                <Text style={styles.filterLabel}>Size</Text>
                <View style={styles.categories}>
                                {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((sizeOption, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.categoryItem, selectedSizes.includes(sizeOption) && styles.selectedCategory]}
                                        onPress={() => toggleSizeSelection(sizeOption)}>
                                        <Text style={styles.categoryText}>{sizeOption}</Text>
                                    </TouchableOpacity>
                                ))}
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
                    <TouchableOpacity onPress={resetFilters} style={styles.buttonReset}>
                        <Text style={styles.buttonText}>Thiết lập lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={applyFilter} style={styles.buttonApply}>
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
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30, // Adjust for status bar
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  banner: {
    marginVertical: 10,
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginBottom: 5,
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  productsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    alignItems: "flex-start",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: "#e53935",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  filterContent: {},
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  buttonReset: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonApply: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
});

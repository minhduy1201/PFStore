import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Keyboard, Image, TextInput, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { searchProducts } from "../servers/ProductService";
import { GetCategories, GetBrands } from '../servers/ProductService';
import ProductCard from "../components/ProductCard";

export default function SearchProductsScreen({ route, navigation }) {
  const { keyword } = route.params; // Nhận từ khóa tìm kiếm từ HomeScreen
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');


  useEffect(() => {
    // Tìm kiếm sản phẩm khi màn hình được render
    const fetchProducts = async () => {
      try {
        const result = await searchProducts(keyword);
        setProducts(result);
      } catch (error) {
        setError("Không thể tìm thấy sản phẩm. Vui lòng thử lại.");
        console.error("Lỗi khi tìm kiếm sản phẩm", error);
      }
    };

    fetchProducts();
  }, [keyword]);

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

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await GetBrands();
        if (res && Array.isArray(res)) {
          setBrands(res);
        } else {
          Alert.alert("Lỗi", "Không thể tải danh sách thương hiệu");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải danh sách thương hiệu");
        console.log("Load category error:", error);
      }
    };
    loadBrands();
  }, []);

  // Xử lý mở/đóng filter popupAdd commentMore actions.
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };


  // Xử lý nút thiết lập lại
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
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

  // Xử lý toggle chọn danh mục
  const toggleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category)); // Bỏ chọn nếu đã chọn
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
      {products.length > 0 ? (
        /*
        products.map((product) => (
          <TouchableOpacity 
          numColumns={2}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}>
            <Text>{product.name}</Text>
            <Text>{product.price}</Text>
          </TouchableOpacity>
        )) */


        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
        
      ) : (
        <Text>Không có sản phẩm nào phù hợp với từ khóa "{keyword}"</Text>
      )}

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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollContainer}>
                <View style={styles.brands}>
                  {brands.map((bra) => (
                    <TouchableOpacity
                      key={bra.brandId.toString()}
                      style={[styles.categoryItem, selectedBrands.includes(bra.name) && styles.selectedCategory]}
                      onPress={() => toggleBrandSelection(bra.name)}>
                      <Text style={styles.categoryText}>{bra.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

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
                      style={[styles.categoryItem, selectedCategories.includes(category.name) && styles.selectedCategory]}
                      onPress={() => toggleCategorySelection(category.name)}>
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
  productCard: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#ccc",
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

  productCard: {
    width: 120,
    marginRight: 16,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  productTitle: {
    marginTop: 5,
    fontSize: 14,
  },
  productPrice: {
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  filterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  filterContent: {
    padding: 10,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonReset: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  buttonApply: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  listContentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});

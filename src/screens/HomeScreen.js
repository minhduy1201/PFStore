import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { GetCategories } from '../servers/ProductService';

export default function HomeScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // lưu token riêng nếu cần
        const user = await AsyncStorage.getItem('user');
        if (!token || !user) {
          // Nếu không có token hoặc user thì quay lại Login
          navigation.replace('Login');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể xác thực phiên đăng nhập');
        navigation.replace('Login');
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
          Alert.alert('Lỗi', 'Không thể tải danh mục sản phẩm');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải danh mục');
        console.log('Load category error:', error);
      }
    };

    loadCategories();
  }, []);

  // Xử lý mở/đóng filter popup
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
      // Đây là nơi bạn sẽ thực hiện việc lọc sản phẩm theo các lựa chọn đã chọn
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
  <TouchableOpacity onPress={toggleFilter}>
    <Ionicons name="filter" size={24} color="black" />
  </TouchableOpacity>
</View>


      {/* Banner khuyến mãi */}
      <View style={styles.banner}>
        <Image
          source={require('../../assets/images/banner.png')}
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
        <View key={index} style={styles.categoryItem}>
          <Text style={styles.categoryText}>{cat.name}</Text>
        </View>
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
                source={require('../../assets/images/demo.jpg')} // Đổi ảnh
                style={styles.productImage}
              />
              <Text style={styles.productTitle}>Sản phẩm {index + 1}</Text>
              <Text style={styles.productPrice}>160.000đ</Text>
            </View>
          ))}
        </ScrollView>
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
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingTop: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#f2f2f2',
    },
    banner: {
      height: 150,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    categories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
   categoryItem: {
  backgroundColor: '#f0f0f0',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  marginRight: 10,
  marginBottom: 10,
},

categoryText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#333',
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
      
  });

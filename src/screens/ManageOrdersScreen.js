import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList, // Use FlatList for rendering lists efficiently
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManageOrdersScreen = ({ navigation }) => {
  // Mock data for orders list (replace with actual data fetching)
  const orders = [
    {
      id: 1,
      orderId: '#92287157',
      product: {
        name: 'Mắt kính chanel',
        shippingMethod: 'Giao Hàng tiêu chuẩn',
        status: 'Đã đóng gói',
        image: 'https://via.placeholder.com/100', // Placeholder image
      },
      action: 'Theo dõi', // 'Theo dõi' or 'Đánh giá'
    },
    {
      id: 2,
       orderId: '#92287157',
      product: {
        name: 'Áo khoác Supreme',
        shippingMethod: 'Giao hàng tiêu chuẩn',
        status: 'Đang vận chuyển',
        image: 'https://via.placeholder.com/100', // Placeholder image
      },
      action: 'Theo dõi',
    },
     {
      id: 3,
       orderId: '#92287157',
      product: {
        name: 'Quần Jean Whose',
        shippingMethod: 'Giao hàng tiêu chuẩn',
        status: 'Đã Nhận',
      image: 'https://via.placeholder.com/100', // Placeholder image
      },
      action: 'Đánh giá',
    },
    {
        id: 4, // New failed order
        orderId: '#92287158', // Different order ID
        product: {
            name: 'Áo thun Nike', // Example product name
            shippingMethod: 'Giao hàng tiêu chuẩn',
            status: 'Giao hàng không thành công',
            image: 'https://via.placeholder.com/100', // Placeholder image
        },
        action: 'Theo dõi', // Still 'Theo dõi' button
        isFailed: true, // Flag to indicate failed delivery
    },
    {
        id: 5, // New successful order
        orderId: '#92287159', // Different order ID
        product: {
            name: 'Áo khoác zip', // Example product name
            shippingMethod: 'Giao hàng tiêu chuẩn',
            status: 'Giao hàng thành công',
            image: 'https://via.placeholder.com/100', // Placeholder image
        },
        action: 'Theo dõi', // Should still be 'Theo dõi' before rating
        isSuccessful: true, // Flag to indicate successful delivery
    },
    // Add more mock orders as needed
  ];

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.shippingMethod}>{item.product.shippingMethod}</Text>
        <Text style={styles.orderStatus}>{item.product.status}</Text>
      </View>
      <View style={styles.orderItemRight}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          {item.action === 'Theo dõi' ? (
              <TouchableOpacity style={styles.actionButton} onPress={() => {
                  if (item.isFailed) {
                      navigation.navigate('FailedDeliveryDetails');
                  } else if (item.isSuccessful) {
                      navigation.navigate('SuccessfulDeliveryDetails');
                  } else {
                      navigation.navigate('OrderDetails');
                  }
              }}>
                  <Text style={styles.actionButtonText}>{item.action}</Text>
              </TouchableOpacity>
          ) : (
               <TouchableOpacity style={styles.actionButton} onPress={() => { console.log('Đánh giá', item.id); /* Implement review logic */ }}>
                  <Text style={styles.actionButtonText}>{item.action}</Text>
              </TouchableOpacity>
          )}
          {item.product.status === 'Đã Nhận' && (
              <Ionicons name="checkmark-circle" size={20} color="#323660" style={styles.receivedIcon} />
          )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           {/* Placeholder for avatar/icon */}
           <View style={styles.avatarPlaceholder}></View>
           <View>
             <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
             <Text style={styles.headerSubtitle}>Trạng thái đơn hàng</Text>
           </View>
        </View>

        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Activity')}>
                 <Ionicons name="list" size={24} color="#323660" />{/* Placeholder icon */}
            </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="settings-outline" size={24} color="#323660" />{/* Placeholder icon */}
            </TouchableOpacity>
        </View>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
      />

       {/* Footer (Placeholder for Tab Bar) */}
       {/* This screen should ideally be part of the Tab Navigator structure */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e0e0e0', // Placeholder color
      marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
   headerSubtitle: {
       fontSize: 14,
       color: '#666',
   },
   headerIcons: {
       flexDirection: 'row',
   },
   headerIcon: {
       marginLeft: 15,
   },
  listContentContainer: {
      padding: 16,
  },
  orderItemContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
       shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
  },
  productImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
  },
  orderItemDetails: {
      flex: 1,
      marginRight: 12,
  },
   productName: {
       fontSize: 16,
       fontWeight: 'bold',
       marginBottom: 4,
   },
   shippingMethod: {
       fontSize: 14,
       color: '#555',
       marginBottom: 8,
   },
   orderStatus: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#323660', // Dark blue color
   },
   orderItemRight: {
       alignItems: 'flex-end',
       justifyContent: 'space-between',
   },
   orderId: {
       fontSize: 12,
       color: '#777',
       marginBottom: 8,
   },
   actionButton: {
       backgroundColor: '#323660', // Dark blue button
       borderRadius: 4,
       paddingVertical: 6,
       paddingHorizontal: 12,
       alignItems: 'center',
   },
   actionButtonText: {
       color: '#fff',
       fontSize: 13,
       fontWeight: 'bold',
   },
    receivedIcon: {
        marginLeft: 0,
        marginTop: 8, // Space below the button
    },
});

export default ManageOrdersScreen; 
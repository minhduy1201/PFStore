import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ navigation }) => {
  // Mock data for order details (replace with actual data fetching)
  const orderDetails = {
    id: '#92287157',
    status: 'chờ xác nhận',
    shippingMethod: 'Giao Hàng tiêu chuẩn',
    product: {
      name: 'Áo hoddie superme đen chữ đỏ',
      price: 170000,
      image: 'https://via.placeholder.com/150', // Placeholder image
    },
    trackingNumber: 'LGS-I92927839300763731',
    orderHistory: [
      {
        status: 'Đã đặt hàng',
        description: 'Bạn xác nhận mua hàng và đang chờ người bán xác nhận',
        date: '19/04 – 12:31',
      },
      // Add more history steps here
    ],
    // You might add more fields like payment method, total amount, etc.
  };

  // Placeholder for progress steps (adjust based on actual order status)
  const progressSteps = [0, 1, 2]; // 3 steps: Ordered, Confirmed, Shipped, Delivered
  const currentStep = 0; // Current step (0 for chờ xác nhận)

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
             <Text style={styles.headerTitle}>Đơn hàng</Text>
             <Text style={styles.headerSubtitle}>Trạng thái đơn hàng</Text>
           </View>
        </View>

        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
                 <Ionicons name="list" size={24} color="#323660" />{/* Placeholder icon */}
            </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="settings-outline" size={24} color="#323660" />{/* Placeholder icon */}
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Order Summary/Product Info */}
        <View style={styles.sectionContainer}>
          <View style={styles.productSummary}>
             <Image source={{ uri: orderDetails.product.image }} style={styles.productImage} />
             <View style={styles.productInfo}>
               <Text style={styles.productName}>{`${orderDetails.product.name} ${orderDetails.id}`}</Text>
               <Text style={styles.shippingMethod}>{orderDetails.shippingMethod}</Text>
                <View style={styles.statusPriceContainer}>
                   <Text style={styles.orderStatus}>{orderDetails.status}</Text>
                    <Text style={styles.productPrice}>{orderDetails.product.price.toLocaleString('vi-VN')}đ</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Order Progress Bar */}
        <View style={styles.sectionContainer}>
           <View style={styles.progressBarContainer}>
               {progressSteps.map((step) => (
                   <View key={step} style={[styles.progressDot, step <= currentStep && styles.progressDotActive]}></View>
               ))}
               <View style={styles.progressBarLine}></View>
                {/* This is a simplified progress bar, a real one would be more complex */}
           </View>
        </View>

        {/* Tracking Number */}
        <View style={styles.sectionContainer}>
            <View style={styles.trackingContainer}>
                <View>
                    <Text style={styles.trackingLabel}>Mã vận đơn</Text>
                    <Text style={styles.trackingNumber}>{orderDetails.trackingNumber}</Text>
                </View>
                 <TouchableOpacity style={styles.trackingIcon}>
                     <Ionicons name="document-text-outline" size={24} color="#323660" />
                 </TouchableOpacity>
            </View>
        </View>

        {/* Order History */}
         <View style={styles.sectionContainer}>
            {orderDetails.orderHistory.map((historyItem, index) => (
                 <View key={index} style={styles.historyItem}>
                     <View style={styles.historyDot}></View>
                     <View style={styles.historyContent}>
                         <View style={styles.historyHeader}>
                             <Text style={styles.historyStatus}>{historyItem.status}</Text>
                             <Text style={styles.historyDate}>{historyItem.date}</Text>
                         </View>
                          <Text style={styles.historyDescription}>{historyItem.description}</Text>
                     </View>
                 </View>
            ))}
        </View>

      </ScrollView>

       {/* Footer (Placeholder for Tab Bar) */}
       {/* You can conditionally render the Tab Bar if this screen is part of a Tab Navigator */}
       {/* For this example, assuming it is part of the Tab Navigator structure setup earlier */}

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
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
   productSummary: {
       flexDirection: 'row',
       alignItems: 'center',
   },
   productImage: {
       width: 80,
       height: 80,
       borderRadius: 8,
       marginRight: 16,
   },
   productInfo: {
       flex: 1,
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
    statusPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
   orderStatus: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#323660', // Dark blue color
   },
   productPrice: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#e91e63', // Pinkish color
   },
   progressBarContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingHorizontal: 20, // Adjust as needed
       marginBottom: 10,
       position: 'relative',
   },
    progressBarLine: {
        position: 'absolute',
        top: '50%',
        left: 25, // Align with dot centers
        right: 25,
        height: 4,
        backgroundColor: '#e0e0e0', // Light gray line
        zIndex: -1, // Behind the dots
    },
   progressDot: {
       width: 12,
       height: 12,
       borderRadius: 6,
       backgroundColor: '#e0e0e0', // Inactive dot color
   },
   progressDotActive: {
       backgroundColor: '#323660', // Active dot color
   },
   trackingContainer: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
   },
   trackingLabel: {
       fontSize: 14,
       color: '#555',
   },
   trackingNumber: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#333',
       marginTop: 4,
   },
   trackingIcon: {
       padding: 5,
   },
   historyItem: {
       flexDirection: 'row',
       marginBottom: 16,
   },
   historyDot: {
       width: 8,
       height: 8,
       borderRadius: 4,
       backgroundColor: '#323660', // Dot color
       marginTop: 5, // Align with text baseline
       marginRight: 10,
   },
   historyContent: {
       flex: 1,
   },
   historyHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       marginBottom: 4,
   },
   historyStatus: {
       fontSize: 15,
       fontWeight: 'bold',
       color: '#333',
   },
   historyDate: {
       fontSize: 13,
       color: '#777',
   },
   historyDescription: {
       fontSize: 14,
       color: '#555',
   },

   // Placeholder styles for Tab Bar (adjust based on your Tab Navigator styles)
   // If using the MainTabs component, these styles might not be needed here.

});

export default OrderDetailsScreen; 
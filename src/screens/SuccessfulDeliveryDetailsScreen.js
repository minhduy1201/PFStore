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

const SuccessfulDeliveryDetailsScreen = ({ navigation }) => {
  // Mock data for successful delivery details (replace with actual data fetching)
  const successfulDeliveryDetails = {
    orderId: '#92287157',
    trackingNumber: 'LGS-I92927839300763731',
    orderHistory: [
      {
        status: 'Đã lấy hàng thành công',
        description: 'Your parcel is packed and will be handed over to our delivery partner.',
        date: '19/04 – 12:31',
      },
      {
        status: 'Đã đến kho trung chuyển',
        description: 'Đơn hàng đã được tiếp nhận tại kho trung chuyển của đơn vị vận chuyển.',
        date: '19/04 – 16:20',
      },
      {
        status: 'Đã giao cho đơn vị vận chuyển',
        description: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển và chuẩn bị giao đến bạn.',
        date: '20/04 – 06:15',
      },
       {
        status: 'Đang giao hàng',
        description: 'Đơn hàng đang được giao đến địa chỉ của bạn. Vui lòng chú ý điện thoại để nhận hàng.',
        date: '22/04 – 11:10',
      },
      {
        status: 'Giao hàng thành công',
        description: 'Đơn hàng đã được giao đến bạn thành công, hãy đánh giá sản phẩm để nhận ưu đãi nhé!',
        date: '22/04 – 11:10', 
        isSuccessful: true,
      },
    ],
    // Actual delivery date
    deliveryDate: '22/04', // Based on image
  };

   // Placeholder for progress steps (adjust based on actual order status)
  const progressSteps = [0, 1, 2, 3, 4]; // Example: Ordered, Shipped, In Transit, Out for Delivery, Delivered
  const currentStep = 4; // Assuming the delivered step is the last step (index 4)

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
             <Text style={styles.headerSubtitle}>Theo dõi đơn hàng</Text>
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

        {/* Order Progress Bar */}
        <View style={styles.sectionContainer}>
           <View style={styles.progressBarContainer}>
               {progressSteps.map((step) => (
                   <View key={step} style={[styles.progressDot, step <= currentStep && styles.progressDotActive]}></View>
               ))}
                <View style={[styles.progressBarLine, styles.progressBarLineActive]}></View>
           </View>
        </View>

        {/* Tracking Number */}
        <View style={styles.sectionContainer}>
            <View style={styles.trackingContainer}>
                <View>
                    <Text style={styles.trackingLabel}>Mã vận đơn</Text>
                    <Text style={styles.trackingNumber}>{successfulDeliveryDetails.trackingNumber}</Text>
                </View>
                 <TouchableOpacity style={styles.trackingIcon}>
                     <Ionicons name="document-text-outline" size={24} color="#323660" />
                 </TouchableOpacity>
            </View>
        </View>

        {/* Order History */}
         <View style={styles.sectionContainer}>
            {successfulDeliveryDetails.orderHistory.map((historyItem, index) => (
                 <View key={index} style={styles.historyItem}>
                     {/* Dot indicates active/inactive status */}
                      <View style={[styles.historyDot, historyItem.isSuccessful ? styles.historyDotSuccessful : null]}></View>
                     <View style={styles.historyContent}>
                         <View style={styles.historyHeader}>
                             <Text style={[styles.historyStatus, historyItem.isSuccessful ? styles.historyStatusSuccessful : null]}>{historyItem.status}</Text>
                             {historyItem.isSuccessful ? (
                                 <View style={styles.successfulDateChip}>
                                     <Text style={styles.successfulDateText}>{historyItem.date}</Text>
                                      <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.successfulCheckIcon} />
                                 </View>
                             ) : (
                                 <Text style={styles.historyDate}>{historyItem.date}</Text>
                             )}
                         </View>
                          <Text style={styles.historyDescription}>{historyItem.description}</Text>
                     </View>
                 </View>
            ))}
             {/* Delivery Date */} {/* Changed from Estimated Delivery */}
             <View style={styles.estimatedDeliveryContainer}> {/* Reusing the style name */} 
                  <Text style={styles.estimatedDeliveryLabel}>Giao hàng</Text>
                   <View style={styles.estimatedDeliveryChip}> {/* Reusing the style name */} 
                       <Text style={styles.estimatedDeliveryText}>Thành công vào {successfulDeliveryDetails.deliveryDate}</Text>
                   </View>
             </View>
        </View>

      </ScrollView>

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
   // Reusing styles from OrderDetailsScreen for common elements
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
   // Progress Bar Styles (adapted for successful state)
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
     progressBarLineActive: {
         backgroundColor: '#28a745', // Green color for successful
         // Note: A real implementation needs a more sophisticated progress bar component
     },
   progressDot: {
       width: 12,
       height: 12,
       borderRadius: 6,
       backgroundColor: '#e0e0e0', // Inactive dot color
       zIndex: 1, // Ensure dots are above the line
   },
   progressDotActive: {
       backgroundColor: '#28a745', // Green color for active/successful
   },

   // Order History Styles (adapted for successful state)
   historyItem: {
       flexDirection: 'row',
       marginBottom: 16,
   },
   historyDot: {
       width: 8,
       height: 8,
       borderRadius: 4,
       backgroundColor: '#323660', // Default dot color
       marginTop: 5,
       marginRight: 10,
   },
    historyDotSuccessful: {
        backgroundColor: '#28a745', // Green dot for successful step
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
    historyStatusSuccessful: {
        color: '#28a745', // Green text for successful status
    },
   historyDate: {
       fontSize: 13,
       color: '#777',
   },
    successfulDateChip: {
        flexDirection: 'row', // To place text and icon side by side
        backgroundColor: '#28a745', // Green background for successful date chip
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
         alignItems: 'center', // Center vertically
    },
    successfulDateText: {
        fontSize: 13,
        color: '#fff', // White text for successful date chip
        fontWeight: 'bold',
        marginRight: 4, // Space between text and icon
    },
    successfulCheckIcon: {
        // Styles already applied by parent view
    },
   historyDescription: {
       fontSize: 14,
       color: '#555',
   },
    // Reusing estimatedDelivery styles for delivery date
    estimatedDeliveryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    estimatedDeliveryLabel: {
        fontSize: 15,
        color: '#555',
    },
    estimatedDeliveryChip: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    estimatedDeliveryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default SuccessfulDeliveryDetailsScreen; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FailedDeliveryDetailsScreen = ({ navigation }) => {
  const [isFailedModalVisible, setIsFailedModalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFailedModalVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for failed delivery details (replace with actual data fetching)
  const failedDeliveryDetails = {
    orderId: '#92287157',
    trackingNumber: 'LGS-I92927839300763731',
    orderHistory: [
      {
        status: 'Đã lấy hàng thành công',
        description: 'Kiện hàng của bạn đã được đóng gói và sẽ được bàn giao cho đối tác vận chuyển.',
        date: '19/04 – 12:31',
        isFailed: false,
      },
      {
        status: 'Đã đến kho trung chuyển',
        description: 'Đơn hàng đã được tiếp nhận tại kho trung chuyển của đơn vị vận chuyển.',
        date: '19/04 – 16:20',
        isFailed: false,
      },
      {
        status: 'Đã giao cho đơn vị vận chuyển',
        description: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển và chuẩn bị giao đến bạn.',
        date: '20/04 – 06:15',
        isFailed: false,
      },
       {
        status: 'Đang giao hàng',
        description: 'Đơn hàng đang được giao đến địa chỉ của bạn. Vui lòng chú ý điện thoại để nhận hàng.',
        date: '22/04 – 11:10',
        isFailed: false,
      },
      {
        status: 'Giao hàng không thành công',
        description: 'Giao hàng vào lúc 12:50 ngày 19/04 nhưng không thành công. Dự kiến giao lại vào ngày 23/04.',
        date: '22/04 – 11:10', // Note: Date in image is 22/04 - 11:10, but text mentions 19/04. Using image date.
        isFailed: true,
      },
      // Add more history steps here
    ],
    // Estimated delivery date placeholder
    estimatedDelivery: 'Dự kiến vào 22/04', // Based on image
  };

   // Placeholder for progress steps (adjust based on actual order status)
  const progressSteps = [0, 1, 2, 3]; // Example: Ordered, Shipped, Out for Delivery, Failed/Delivered
  const currentStep = 3; // Assuming the failed step is the 4th step (index 3)


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
                   <View key={step} style={[styles.progressDot, step <= currentStep && (step < progressSteps.length - 1 ? styles.progressDotActive : styles.progressDotFailed)]}></View>
               ))}
               {/* Simplified line - a real one would adjust based on progress */}
               <View style={[styles.progressBarLine, styles.progressBarLineActive]}></View>
           </View>
        </View>

        {/* Tracking Number */}
        <View style={styles.sectionContainer}>
            <View style={styles.trackingContainer}>
                <View>
                    <Text style={styles.trackingLabel}>Mã vận đơn</Text>
                    <Text style={styles.trackingNumber}>{failedDeliveryDetails.trackingNumber}</Text>
                </View>
                 <TouchableOpacity style={styles.trackingIcon}>
                     <Ionicons name="document-text-outline" size={24} color="#323660" />
                 </TouchableOpacity>
            </View>
        </View>

        {/* Order History */}
         <View style={styles.sectionContainer}>
            {failedDeliveryDetails.orderHistory.map((historyItem, index) => (
                 <View key={index} style={styles.historyItem}>
                     {/* Dot indicates active/inactive status */}
                      <View style={[styles.historyDot, historyItem.isFailed ? styles.historyDotFailed : null]}></View>
                     <View style={styles.historyContent}>
                         <View style={styles.historyHeader}>
                             <Text style={[styles.historyStatus, historyItem.isFailed ? styles.historyStatusFailed : null]}>{historyItem.status}</Text>
                             {historyItem.isFailed ? (
                                 <View style={styles.failedDateChip}>
                                     <Text style={styles.failedDateText}>{historyItem.date}</Text>
                                 </View>
                             ) : (
                                 <Text style={styles.historyDate}>{historyItem.date}</Text>
                             )}
                         </View>
                          <Text style={styles.historyDescription}>{historyItem.description}</Text>
                     </View>
                 </View>
            ))}
             {/* Estimated Delivery - only show if relevant, potentially based on status */}
              {/* For failed, might show re-delivery estimate */}
             <View style={styles.estimatedDeliveryContainer}>
                  <Text style={styles.estimatedDeliveryLabel}>Giao hàng</Text>{/* Text from image */}
                   <View style={styles.estimatedDeliveryChip}>
                       <Text style={styles.estimatedDeliveryText}>{failedDeliveryDetails.estimatedDelivery}</Text>
                   </View>
             </View>
        </View>

      </ScrollView>

       {/* Failed Delivery Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFailedModalVisible}
        onRequestClose={() => {
          setIsFailedModalVisible(!isFailedModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Giao hàng không thành công</Text>
            <Text style={styles.modalSubtitle}>Bạn nên làm gì?</Text>
            <Text style={styles.modalText}>
              Đừng lo! Chúng tôi sẽ sớm liên hệ với bạn để sắp xếp lại
              thời gian giao hàng phù hợp hơn.
            </Text>
             <Text style={styles.modalText}>
              Chat với bộ phận chăm sóc khách hàng để được hỗ trợ
              ngay.
            </Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                console.log('Chat button pressed'); // Implement chat logic
                setIsFailedModalVisible(false); // Close modal on button press
              }}>
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
   // Progress Bar Styles (adapted for failed state)
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
         // This would typically be a dynamic width based on progress
         // For failed, we might show it filling up to the point of failure or differently
         // Simple approach: color the whole line as active/failed up to the last point
         backgroundColor: '#323660', // Active color
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
       backgroundColor: '#323660', // Active color
   },
    progressDotFailed: {
        backgroundColor: '#e74c3c', // Red color for failed
    },

   // Order History Styles (adapted for failed state)
   historyItem: {
       flexDirection: 'row',
       marginBottom: 16,
   },
   historyDot: {
       width: 8,
       height: 8,
       borderRadius: 4,
       backgroundColor: '#323660', // Default dot color
       marginTop: 5, // Align with text baseline
       marginRight: 10,
   },
    historyDotFailed: {
        backgroundColor: '#e74c3c', // Red dot for failed step
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
    historyStatusFailed: {
        color: '#e74c3c', // Red text for failed status
    },
   historyDate: {
       fontSize: 13,
       color: '#777',
   },
    failedDateChip: {
        backgroundColor: '#e74c3c', // Red background for failed date chip
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    failedDateText: {
        fontSize: 13,
        color: '#fff', // White text for failed date chip
        fontWeight: 'bold',
    },
   historyDescription: {
       fontSize: 14,
       color: '#555',
   },
    estimatedDeliveryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10, // Space after history items
    },
    estimatedDeliveryLabel: {
        fontSize: 15,
        color: '#555', // Gray color like in the image
    },
    estimatedDeliveryChip: {
        backgroundColor: '#e0e0e0', // Light gray background from image
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    estimatedDeliveryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333', // Dark text
    },

   // Placeholder styles for Tab Bar

   // Styles for the Failed Delivery Modal
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end', // Align to bottom
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    modalView: {
      width: '100%',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
         color: '#323660', // Dark blue color
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
      color: '#555',
      lineHeight: 22,
    },
    chatButton: {
      backgroundColor: '#323660', // Dark blue color from image
      borderRadius: 8,
      padding: 15,
      elevation: 2,
      width: '100%', // Full width button
      alignItems: 'center',
      marginTop: 10,
    },
    chatButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
});

export default FailedDeliveryDetailsScreen; 
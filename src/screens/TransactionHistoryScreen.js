import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList, // Using FlatList for the list of transactions
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionHistoryScreen = ({ navigation }) => {
  // Mock data for transaction history (replace with actual data fetching)
  const transactions = [
    {
      id: 1,
      product: {
        name: 'Quần Jean Nam/Nữ Size L – Form Rộng, Cổ Điển',
        orderId: '#92287157',
        date: '06/04/2025',
        image: 'https://via.placeholder.com/100', // Placeholder image
      },
    },
    {
      id: 2,
      product: {
        name: 'Kính Râm Chanel Chính Hãng – Thiết Kế Thời Trang',
        orderId: '#92287157',
        date: '01/04/2025',
        image: 'https://via.placeholder.com/100', // Placeholder image
      },
    },
    // Add more mock transactions as needed
  ];

  // State cho modal đánh giá
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  // State cho modal hoàn thành
  const [isCompleteModalVisible, setCompleteModalVisible] = useState(false);
  const [lastRating, setLastRating] = useState(0);

  // Hàm mở modal đánh giá
  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setRating(0);
    setReviewText('');
    setReviewModalVisible(true);
  };

  // Hàm gửi đánh giá
  const handleSendReview = () => {
    setReviewModalVisible(false);
    setLastRating(rating);
    setTimeout(() => setCompleteModalVisible(true), 300); // Đợi modal đánh giá đóng rồi mới hiện modal hoàn thành
    setTimeout(() => setCompleteModalVisible(false), 1800); // Tự động ẩn sau 1.5s
  };

  // Render dãy sao
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={36}
            color={'#FFB800'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>{stars}</View>;
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItemContainer}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.transactionItemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.orderId}>{item.product.orderId}</Text>
        <View style={styles.dateReviewContainer}>
            <View style={styles.dateChip}>
                 <Text style={styles.dateText}>{item.product.date}</Text>
            </View>
            <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal(item)}>
                <Text style={styles.reviewButtonText}>Đánh giá</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> {/* Assuming we might navigate back from here */}
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           {/* Placeholder for avatar/icon */}
           <View style={styles.avatarPlaceholder}></View>
           <View>
             <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
             {/* Subtitle could be added here if needed */}
           </View>
        </View>

        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
                 <Ionicons name="menu" size={24} color="#323660" />{/* Placeholder for filter/sort icon */}
            </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="settings-outline" size={24} color="#323660" />{/* Placeholder for settings icon */}
            </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={modalStyles.modalBackground}>
              <View style={modalStyles.modalContainer}>
                {/* Tiêu đề */}
                <Text style={modalStyles.modalTitle}>Đánh giá</Text>
                {/* Thông tin người bán và đơn hàng */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={modalStyles.avatar}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, color: '#333' }}>
                      Người bán: <Text style={{ fontWeight: 'bold' }}>Tường An</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#323660', fontWeight: 'bold' }}>
                      Đơn hàng {selectedOrder?.product.orderId}
                    </Text>
                  </View>
                </View>
                {/* Dãy sao */}
                {renderStars()}
                {/* Ô nhập đánh giá */}
                <TextInput
                  style={modalStyles.textInput}
                  placeholder="Nhập đánh giá của bạn..."
                  placeholderTextColor="#888"
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                  numberOfLines={4}
                />
                {/* Nút gửi */}
                <TouchableOpacity style={modalStyles.sendButton} onPress={handleSendReview}>
                  <Text style={modalStyles.sendButtonText}>Gửi đi!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Complete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCompleteModalVisible}
        onRequestClose={() => setCompleteModalVisible(false)}
      >
        <View style={completeModalStyles.overlay}>
          <View style={completeModalStyles.container}>
            <View style={completeModalStyles.iconCircle}>
              <Ionicons name="checkmark" size={32} color="#323660" />
            </View>
            <Text style={completeModalStyles.title}>Hoàn thành!</Text>
            <Text style={completeModalStyles.subtitle}>Cảm ơn bài đánh giá của bạn</Text>
            <View style={completeModalStyles.starsRow}>
              {[1,2,3,4,5].map(i => (
                <Ionicons
                  key={i}
                  name={i <= lastRating ? 'star' : 'star-outline'}
                  size={36}
                  color={'#FFB800'}
                  style={{ marginHorizontal: 2 }}
                />
              ))}
            </View>
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
   headerIcons: {
       flexDirection: 'row',
   },
   headerIcon: {
       marginLeft: 15,
   },
    listContentContainer: {
        padding: 16,
    },
    transactionItemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
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
    transactionItemDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
     dateReviewContainer: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
     },
     dateChip: {
         backgroundColor: '#f0f0f0', // Light gray background from image
         borderRadius: 4,
         paddingHorizontal: 8,
         paddingVertical: 4,
     },
     dateText: {
         fontSize: 13,
         color: '#333',
         fontWeight: 'bold',
     },
     reviewButton: {
         borderWidth: 1,
         borderColor: '#323660', // Dark blue border
         borderRadius: 4,
         paddingVertical: 6,
         paddingHorizontal: 12,
         alignItems: 'center',
     },
     reviewButtonText: {
         color: '#323660', // Dark blue text
         fontSize: 13,
         fontWeight: 'bold',
     },
});

// Thêm style cho modal đánh giá
const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'left',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 18,
    minHeight: 70,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#323660',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 0,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Thêm style cho modal hoàn thành
const completeModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingTop: 44,
    paddingBottom: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  iconCircle: {
    position: 'absolute',
    top: -32,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#E6E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },
});

export default TransactionHistoryScreen; 
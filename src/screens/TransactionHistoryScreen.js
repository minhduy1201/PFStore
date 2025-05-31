import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList, // Using FlatList for the list of transactions
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
            <TouchableOpacity style={styles.reviewButton}>
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

export default TransactionHistoryScreen; 
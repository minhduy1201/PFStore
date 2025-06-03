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

// Placeholder for a chart component (you might use a library like react-native-svg-charts or react-native-chart-kit)
const CircularProgressChart = ({ data, total }) => {
  // This is a simplified placeholder. A real implementation would draw arcs based on data.
  return (
    <View style={styles.chartPlaceholder}>
      <Text style={styles.chartTotalLabel}>Tổng</Text>
      <Text style={styles.chartTotalValue}>{total}vnđ</Text>
    </View>
  );
};

const ActivityScreen = ({ navigation }) => {
  // Mock data (replace with actual data fetching)
  const month = 'Tháng 4';
  const totalSpent = '1.350.000';
  const categoryData = [
    { name: 'Quần', amount: '183.000', color: '#323660' }, // Dark blue
    { name: 'Giày', amount: '92.000', color: '#8bc34a' }, // Light green
    { name: 'Áo', amount: '47.000', color: '#ff9800' }, // Orange
    { name: 'Túi', amount: '43.000', color: '#e91e63' }, // Pink
  ];

  const orderCounts = [
      { label: 'Đơn đã đặt', count: 12 },
      { label: 'Đã Nhận', count: 7 },
      { label: 'Đang vận chuyển', count: 5 },
  ];

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
             <Text style={styles.headerTitle}>Hoạt động</Text>
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

      <ScrollView style={styles.scrollView}>

        {/* Month Selector */}
        <View style={styles.monthSelectorContainer}>
            <TouchableOpacity>
                 <Ionicons name="chevron-back" size={24} color="#323660" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{month}</Text>
             <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#323660" />
            </TouchableOpacity>
        </View>

        {/* Circular Progress Chart */}
        <View style={styles.chartContainer}>
          <CircularProgressChart data={categoryData} total={totalSpent} />
        </View>

        {/* Category Chips */}
        <View style={styles.categoryContainer}>
          {categoryData.map((category, index) => (
            <View key={index} style={[styles.categoryChip, { backgroundColor: category.color }]}>
              <Text style={styles.categoryText}>{category.name} {category.amount}đ</Text>
            </View>
          ))}
        </View>

        {/* Order Counts */}
        <View style={styles.orderCountsContainer}>
             {orderCounts.map((item, index) => (
                 <View key={index} style={styles.orderCountItem}>
                     <View style={styles.orderCountCircle}>
                         <Text style={styles.orderCountText}>{item.count}</Text>
                     </View>
                     <Text style={styles.orderCountLabel}>{item.label}</Text>
                 </View>
             ))}
        </View>

        {/* Transaction History Button */}
        <View style={styles.transactionButtonContainer}>
            <TouchableOpacity style={styles.transactionButton} onPress={() => navigation.navigate('TransactionHistory')}>
                 <Text style={styles.transactionButtonText}>Lịch sử giao dịch</Text>
            </TouchableOpacity>
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
   headerIcons: {
       flexDirection: 'row',
   },
   headerIcon: {
       marginLeft: 15,
   },
  scrollView: {
    flex: 1,
  },
   monthSelectorContainer: {
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       paddingVertical: 10,
       backgroundColor: '#fff',
       marginHorizontal: 16,
       marginTop: 16,
       borderRadius: 8,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 1 },
       shadowOpacity: 0.1,
       shadowRadius: 2,
       elevation: 2,
   },
    monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
     chartPlaceholder: {
         width: 180,
         height: 180,
         borderRadius: 90,
         borderWidth: 15,
         borderColor: '#e0e0e0', // Light gray border for placeholder
         justifyContent: 'center',
         alignItems: 'center',
     },
     chartTotalLabel: {
         fontSize: 14,
         color: '#555',
     },
     chartTotalValue: {
         fontSize: 22,
         fontWeight: 'bold',
         color: '#333',
     },
     categoryContainer: {
         flexDirection: 'row',
         flexWrap: 'wrap',
         justifyContent: 'center',
         marginHorizontal: 16,
         marginBottom: 20,
     },
     categoryChip: {
         borderRadius: 20,
         paddingVertical: 8,
         paddingHorizontal: 15,
         margin: 5,
     },
     categoryText: {
         color: '#fff',
         fontSize: 14,
         fontWeight: 'bold',
     },
    orderCountsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 16,
        marginBottom: 20,
    },
     orderCountItem: {
         alignItems: 'center',
     },
     orderCountCircle: {
         width: 50,
         height: 50,
         borderRadius: 25,
         backgroundColor: '#323660', // Dark blue
         justifyContent: 'center',
         alignItems: 'center',
         marginBottom: 5,
     },
     orderCountText: {
         fontSize: 18,
         fontWeight: 'bold',
         color: '#fff',
     },
     orderCountLabel: {
         fontSize: 13,
         color: '#555',
     },
    transactionButtonContainer: {
        marginHorizontal: 16,
        marginBottom: 20,
    },
     transactionButton: {
         backgroundColor: '#323660', // Dark blue
         borderRadius: 8,
         paddingVertical: 15,
         alignItems: 'center',
     },
     transactionButtonText: {
         color: '#fff',
         fontSize: 18,
         fontWeight: 'bold',
     },
});

export default ActivityScreen; 
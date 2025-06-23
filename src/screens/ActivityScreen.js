import React, { useEffect, useState } from 'react';
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
import { getUserId } from '../servers/AuthenticationService';
import { getOrdersByBuyer } from '../servers/OrderService';
import { GetCategories } from '../servers/ProductService';

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

const CATEGORY_COLORS = [
  '#1976D2', // Blue
  '#43A047', // Green
  '#FBC02D', // Yellow
  '#E64A19', // Orange
  '#8E24AA', // Purple
  '#D81B60', // Pink
  '#00897B', // Teal
  '#F4511E', // Deep Orange
  '#3949AB', // Indigo
  '#00ACC1', // Cyan
  '#C0CA33', // Lime
  '#5E35B1', // Deep Purple
];

const ActivityScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [orderCounts, setOrderCounts] = useState([
    { label: 'Đơn đã đặt', count: 0 },
    { label: 'Đã Nhận', count: 0 },
    { label: 'Đang vận chuyển', count: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy userId
        const userId = await getUserId();
        if (!userId) throw new Error('Không tìm thấy userId');
        // Lấy đơn hàng
        const orders = await getOrdersByBuyer(userId) || [];
        // Lấy danh mục
        const categories = await GetCategories() || [];
        // Lấy tháng hiện tại
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        setMonth(`Tháng ${currentMonth}`);
        // Lọc đơn hàng trong tháng hiện tại
        const ordersThisMonth = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === now.getFullYear();
        });
        // Tổng chi tiêu tháng
        const total = ordersThisMonth.reduce((sum, order) => sum + (order.finalTotal || 0), 0);
        setTotalSpent(total);
        // Thống kê chi tiêu theo danh mục
        // Map: { categoryId: { name, amount, color } }
        const categoryMap = {};
        categories.forEach((cat, idx) => {
          categoryMap[cat.categoryId] = {
            name: cat.name,
            amount: 0,
            color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
          };
        });
        ordersThisMonth.forEach(order => {
          (order.orderDetails || []).forEach(item => {
            const catId = item.product?.categoryId;
            const amount = (item.snapshotPrice || 0) * (item.quantity || 1);
            if (catId && categoryMap[catId]) {
              categoryMap[catId].amount += amount;
            }
          });
        });
        // Lọc ra các danh mục có chi tiêu > 0
        const categoryStats = Object.values(categoryMap).filter(c => c.amount > 0).map(c => ({
          ...c,
          amount: c.amount,
        }));
        setCategoryData(categoryStats);
        // Thống kê số lượng đơn theo trạng thái
        let countPlaced = ordersThisMonth.length;
        let countReceived = ordersThisMonth.filter(o => o.status === 'delivered').length;
        let countShipping = ordersThisMonth.filter(o => o.status === 'shipping').length;
        setOrderCounts([
          { label: 'Đơn đã đặt', count: countPlaced },
          { label: 'Đã Nhận', count: countReceived },
          { label: 'Đang vận chuyển', count: countShipping },
        ]);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#323660', marginBottom: 10 }}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: 'red', marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); setError(null); }} style={{ padding: 10, backgroundColor: '#323660', borderRadius: 8 }}>
            <Text style={{ color: '#fff' }}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <View style={styles.avatarPlaceholder}></View>
           <View>
             <Text style={styles.headerTitle}>Hoạt động</Text>
           </View>
        </View>
        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
                 <Ionicons name="menu" size={24} color="#323660" />
            </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="settings-outline" size={24} color="#323660" />
            </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Month Selector */}
        <View style={styles.monthSelectorContainer}>
            <TouchableOpacity disabled>
                 <Ionicons name="chevron-back" size={24} color="#323660" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{month}</Text>
             <TouchableOpacity disabled>
                <Ionicons name="chevron-forward" size={24} color="#323660" />
            </TouchableOpacity>
        </View>
        {/* Circular Progress Chart */}
        <View style={styles.chartContainer}>
          <CircularProgressChart data={[]} total={totalSpent.toLocaleString('vi-VN')} />
        </View>
        {/* Order Counts */}
        <View style={styles.orderCountsContainer}>
             {orderCounts.map((item, index) => (
                 <View key={index} style={[styles.orderCountItem]}> 
                     <View style={[styles.orderCountCircle, 
                       index === 0 && { backgroundColor: '#1976D2' }, // Đơn đã đặt - xanh dương
                       index === 1 && { backgroundColor: '#43A047' }, // Đã nhận - xanh lá
                       index === 2 && { backgroundColor: '#FFA000' }  // Đang vận chuyển - cam
                     ]}>
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
         borderRadius: 24,
         paddingVertical: 10,
         paddingHorizontal: 20,
         margin: 7,
         minWidth: 90,
         alignItems: 'center',
         justifyContent: 'center',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.15,
         shadowRadius: 4,
         elevation: 3,
     },
     categoryText: {
         color: '#fff',
         fontSize: 15,
         fontWeight: 'bold',
         textAlign: 'center',
         letterSpacing: 0.2,
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
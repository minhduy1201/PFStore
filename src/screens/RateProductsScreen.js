import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRating } from '../servers/ProductService';

const RateProductsScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [ratings, setRatings] = useState({}); // Stores ratings as { productId: { stars: number, comment: string } }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize ratings state for unreviewed products
    const initialRatings = {};
    order.products.forEach(product => {
      if (!product.isReviewed) {
        initialRatings[product.productId] = { stars: 0, comment: '' };
      }
    });
    setRatings(initialRatings);
  }, [order]);

  const handleRatingChange = (productId, newStars) => {
    setRatings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], stars: newStars },
    }));
  };

  const handleCommentChange = (productId, text) => {
    setRatings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment: text },
    }));
  };

  const handleSubmitReviews = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const ratingPromises = Object.entries(ratings).map(([productId, ratingData]) => {
        if (ratingData.stars > 0) {
          const payload = {
            userId: parseInt(userId),
            productId: parseInt(productId),
            stars: ratingData.stars,
            comment: ratingData.comment,
          };
          return createRating(payload);
        }
        return Promise.resolve(); // Resolve immediately if no rating given
      });

      await Promise.all(ratingPromises);

      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi thành công!");
      navigation.goBack();

    } catch (error) {
      console.error("Failed to submit reviews:", error);
      // Error is handled in service, but a generic message is good
      Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (productId, currentStars) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRatingChange(productId, i)}>
          <Ionicons
            name={i <= currentStars ? 'star' : 'star-outline'}
            size={32}
            color={'#FFB800'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>{stars}</View>;
  };

  const productsToReview = order.products.filter(p => !p.isReviewed);

  if (productsToReview.length === 0) {
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
                <View style={{width: 24}}/>
            </View>
            <View style={styles.centeredMessage}>
                <Text>Tất cả sản phẩm trong đơn hàng này đã được đánh giá.</Text>
            </View>
        </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đánh giá đơn hàng {order.orderId}</Text>
            <View style={{width: 24}}/>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {productsToReview.map(product => (
            <View key={product.productId} style={styles.productContainer}>
              <View style={styles.productInfo}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              </View>
              {renderStars(product.productId, ratings[product.productId]?.stars || 0)}
              <TextInput
                style={styles.reviewInput}
                placeholder="Viết đánh giá của bạn ở đây..."
                value={ratings[product.productId]?.comment || ''}
                onChangeText={(text) => handleCommentChange(product.productId, text)}
                multiline
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReviews} disabled={loading}>
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            )}
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContainer: { padding: 15, paddingBottom: 80 },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },

  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#323660',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default RateProductsScreen; 
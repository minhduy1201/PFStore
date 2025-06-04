import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text>Bạn chưa đặt mua sản phẩm nào</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

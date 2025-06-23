import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Logout } from "../servers/connection";

const ProfileScreen = ({ navigation }) => {
  // Hàm xử lý khi nhấn vào một mục menu
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  //Hàm đăng xuất
  const handleLogout = () => {
    Logout(navigation);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề trang */}
      <Text style={styles.header}>Cài đặt</Text>

      {/* Nhóm "Thông tin cá nhân" */}
      <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("EditProfile")}
        >
          <Text style={styles.menuItemText}>Chỉnh sửa hồ sơ</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
        </TouchableOpacity>
        <View style={styles.separator} /> {/* Đường kẻ phân cách */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("PaymentMethodScreen")}
        >
          <Text style={styles.menuItemText}>Phương thức thanh toán</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Nhóm "Ứng Dụng" */}
      <Text style={styles.sectionTitle}>Ứng Dụng</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("TransactionHistory")}
        >
          <Text style={styles.menuItemText}>Lịch sử giao dịch</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("ManageOrders")}
        >
          <Text style={styles.menuItemText}>Quản lý đơn hàng</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("SellerOrders")}
        >
          <Text style={styles.menuItemText}>Quản lý bán hàng</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("AppInfo")}
        >
          <Text style={styles.menuItemText}>Thông tin ứng dụng</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Nút Đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 80, 
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 30,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowRadius: 3,
    elevation: 3, 
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0", // Màu đường kẻ mờ
    marginHorizontal: 20, // Không kéo dài hết chiều rộng để tạo hiệu ứng đẹp hơn
  },
  logoutButton: {
    backgroundColor: "transparent", // Nút đăng xuất không có nền
    alignItems: "flex-start", // Căn trái như hình
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40, // Khoảng trống ở cuối trang
  },
  logoutButtonText: {
    fontSize: 16,
    color: "red", // Chữ màu đỏ
    fontWeight: "500",
  },
});

export default ProfileScreen;

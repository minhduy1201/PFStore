import React from "react";
import { Image, ScrollView, StyleSheet, View, Text } from "react-native";

const AppInfoScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logoImage} // Thêm style cho ảnh để kiểm soát kích thước
        />
      </View>

      <View>
        <Text style={styles.header}>Về Pass Fashion</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.paragraph}>
          Pass Fashion là ứng dụng giúp bạn trao đổi, mua bán đồ thời trang đã
          qua sử dụng một cách nhanh chóng, an toàn và tiện lợi. Chúng tôi tin
          rằng mỗi món đồ đều có thể có “vòng đời thứ hai” nếu được trao lại
          đúng người cần.
        </Text>

        <Text style={styles.heading}>Với Pass Fashion, bạn có thể:</Text>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>
            Đăng bán quần áo, túi xách, kính mát, phụ kiện,... bạn không còn sử
            dụng.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>
            Tìm kiếm những món hàng thời trang đẹp, giá tốt từ cộng đồng.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>
            Lọc sản phẩm theo vị trí để dễ gặp mặt, thử đồ trực tiếp.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>
            Xem đánh giá người dùng để đảm bảo giao dịch minh bạch và tin cậy.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>
            Quản lý đơn hàng và lịch sử giao dịch dễ dàng.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Mỗi món đồ bạn pass lại là một hành động góp phần giảm rác thải thời
          trang và bảo vệ môi trường.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AppInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Để ScrollView chiếm toàn bộ màn hình
    backgroundColor: "#fff", // Màu nền trắng
  },
  // Nếu có logo, bỏ comment phần này và điều chỉnh kích thước
  logoContainer: {
    alignItems: "center",
    marginTop: 50, // Khoảng cách từ trên xuống
    marginBottom: 20,
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: "contain", //ảnh hiển thị đầy đủ
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 20,
    color: "#333",
  },
  contentWrapper: {
    paddingHorizontal: 20, // Khoảng cách lề trái phải cho toàn bộ nội dung
    paddingTop: 10, // Khoảng cách từ top (nếu không có logo)
    paddingBottom: 30, // Khoảng cách đáy
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24, // Khoảng cách dòng để dễ đọc
    marginBottom: 15, // Khoảng cách giữa các đoạn văn
    color: "#333", // Màu chữ hơi xám để dễ đọc
  },
  heading: {
    fontSize: 16, // Kích thước tương tự đoạn văn, nhưng có thể đậm hơn
    fontWeight: "bold", // Đậm
    marginBottom: 10, // Khoảng cách trước danh sách
    color: "#333",
  },
  listItem: {
    flexDirection: "row", // Sắp xếp bullet và text trên cùng một hàng
    marginBottom: 8, // Khoảng cách giữa các mục trong danh sách
    alignItems: "flex-start", // Căn chỉnh top của bullet và text
  },
  bullet: {
    fontSize: 16,
    marginRight: 8, // Khoảng cách giữa bullet và text
    color: "#333",
  },
  listItemText: {
    flex: 1, // Để text chiếm phần còn lại của không gian
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

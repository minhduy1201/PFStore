// src/screens/EditProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  fetchProfileData,
  updateProfileData,
  changeUserPassword,
} from "../servers/ProfileService";
import { getProvinces, getDistricts, getWards } from "../servers/LocationService";

const EditProfileScreen = ({ navigation, route }) => {
  // Lấy userId từ params hoặc context/store
  const userId = route?.params?.userId ?? 1;

  // State chính để lưu trữ tất cả thông tin hồ sơ
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading chung cho toàn màn hình hoặc các thao tác
  const [error, setError] = useState(null); // Trạng thái lỗi (nếu có)

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
    useState(false);

  // Dropdown states
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [wardOpen, setWardOpen] = useState(false);

  const [provinceValue, setProvinceValue] = useState(null);
  const [districtValue, setDistrictValue] = useState(null);
  const [wardValue, setWardValue] = useState(null);

  const [provinceItems, setProvinceItems] = useState([]);
  const [districtItems, setDistrictItems] = useState([]);
  const [wardItems, setWardItems] = useState([]);

  //Hàm render
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProfileData(userId);
        setProfileData(data);

        // Nếu có city, tìm code tương ứng để set cho provinceValue
        if (data.diaChi?.thanhPho) {
          const provinces = await getProvinces();
          const foundProvince = provinces.find(
            (p) => p.name === data.diaChi.thanhPho
          );
          if (foundProvince) setProvinceValue(foundProvince.code);
        }
        // Nếu có thể, bạn cũng có thể set districtValue, wardValue tương tự
      } catch (err) {
        setError("Không thể tải dữ liệu hồ sơ.");
        console.error("Lỗi khi tải dữ liệu trong EditProfileScreen:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Load provinces khi mở màn hình
  useEffect(() => {
    getProvinces().then((data) => {
      setProvinceItems(data.map((p) => ({ label: p.name, value: p.code })));
    });
  }, []);

  // Load districts khi chọn tỉnh
  useEffect(() => {
    if (provinceValue) {
      getDistricts(provinceValue).then((data) => {
        setDistrictItems(data.map((d) => ({ label: d.name, value: d.code })));
        setDistrictValue(null);
        setWardItems([]);
        setWardValue(null);
      });
    }
  }, [provinceValue]);

  // Load wards khi chọn huyện
  useEffect(() => {
    if (districtValue) {
      getWards(districtValue).then((data) => {
        setWardItems(data.map((w) => ({ label: w.name, value: w.code })));
        setWardValue(null);
      });
    }
  }, [districtValue]);

  // Khi chọn tỉnh, cập nhật city (tên tỉnh) cho profileData
  useEffect(() => {
    if (provinceValue && provinceItems.length > 0) {
      const selected = provinceItems.find((p) => p.value === provinceValue);
      if (selected) {
        handleProfileDataChange("diaChi.thanhPho", selected.label);
      }
    }
  }, [provinceValue]);

  // --- Hàm cập nhật giá trị của profileData ---
  const handleProfileDataChange = (field, value) => {
    setProfileData((prevData) => {
      if (!prevData) return prevData; // Đảm bảo prevData không null khi cập nhật

      if (field.includes(".")) {
        const [parentField, childField] = field.split(".");
        return {
          ...prevData, //sao chép thay vì ghi đè lên cái cũ
          [parentField]: {
            ...prevData[parentField],
            [childField]: value,
          },
        };
      }
      return {
        ...prevData,
        [field]: value,
      };
    });
  };

  // --- Hàm xử lý cập nhật hồ sơ ---
  const handleUpdateProfile = async () => {
    if (!profileData) {
      Alert.alert("Lỗi", "Dữ liệu hồ sơ chưa sẵn sàng để cập nhật.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfileData(userId, profileData);
      Alert.alert("Thành công", response.message || "Hồ sơ đã được cập nhật!");
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ trong EditProfileScreen:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Hàm xử lý đổi mật khẩu ---
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const response = await changeUserPassword(oldPassword, newPassword);
      Alert.alert("Thành công", response.message || "Mật khẩu đã được đổi!");
      // Xóa các trường mật khẩu sau khi đổi thành công
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Lỗi đổi mật khẩu trong EditProfileScreen:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Conditional Rendering: Hiển thị trạng thái loading hoặc lỗi ---
  if (loading && !profileData) {
    // Chỉ hiển thị loading lúc ban đầu khi profileData chưa có
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4472C4" />
        <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  if (error) {
    // Nếu có lỗi sau khi tải ban đầu
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadProfile()}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Nếu profileData vẫn là null sau khi loading = false và không có lỗi (trường hợp không mong muốn)
  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Đã xảy ra lỗi không xác định hoặc không có dữ liệu hồ sơ.
        </Text>
      </View>
    );
  }

  // Tách họ và tên từ fullName
  const fullName = profileData.fullName || "";
  const nameParts = fullName.trim().split(" ");
  const ho = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : fullName;
  const ten = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  // --- UI chính khi dữ liệu đã được tải thành công ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        {/* Phần Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profileData.avatarUrl }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.updateAvatarButton}>
            <Text style={styles.updateAvatarText}>update</Text>
          </TouchableOpacity>
        </View>

        {/* --- Thông tin tài khoản --- */}
        <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
        <View style={styles.formSection}>
          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>HỌ</Text>
              <TextInput
                style={styles.input}
                value={ho}
                onChangeText={(text) => handleProfileDataChange("ho", text)}
                placeholder="Nhập họ"
              />
            </View>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>TÊN</Text>
              <TextInput
                style={styles.input}
                value={ten}
                onChangeText={(text) => handleProfileDataChange("ten", text)}
                placeholder="Nhập tên"
              />
            </View>
          </View>

          <View style={styles.inputGroupFull}>
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(text) => handleProfileDataChange("email", text)}
              placeholder="Email"
              keyboardType="email-address"
              editable={false} // Thường email không cho chỉnh sửa sau khi đăng ký
            />
          </View>

          <View style={styles.inputGroupFull}>
            <TextInput
              style={styles.input}
              value={profileData.soDienThoai}
              onChangeText={(text) =>
                handleProfileDataChange("soDienThoai", text)
              }
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* --- Địa chỉ --- */}
        <Text style={styles.sectionTitle}>Địa chỉ</Text>
        <View style={styles.formSection}>
          {/* Placeholder Bản đồ */}
          <View style={styles.mapPlaceholderContainer}>
            <Image
              source={{ uri: profileData.mapImageUrl }}
              style={styles.mapPlaceholder}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>TỈNH/THÀNH PHỐ</Text>
              <DropDownPicker
                open={provinceOpen}
                value={provinceValue}
                items={provinceItems}
                setOpen={setProvinceOpen}
                setValue={setProvinceValue}
                setItems={setProvinceItems}
                placeholder="Chọn tỉnh/thành phố"
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownBox}
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>QUẬN/HUYỆN</Text>
              <DropDownPicker
                open={districtOpen}
                value={districtValue}
                items={districtItems}
                setOpen={setDistrictOpen}
                setValue={setDistrictValue}
                setItems={setDistrictItems}
                placeholder="Chọn quận/huyện"
                disabled={!provinceValue}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownBox}
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>XÃ/PHƯỜNG</Text>
              <DropDownPicker
                open={wardOpen}
                value={wardValue}
                items={wardItems}
                setOpen={setWardOpen}
                setValue={setWardValue}
                setItems={setWardItems}
                placeholder="Chọn xã/phường"
                disabled={!districtValue}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownBox}
                zIndex={1000}
                zIndexInverse={3000}
              />
            </View>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>TÊN ĐƯỜNG, SỐ NHÀ</Text>
              <TextInput
                style={styles.input}
                value={profileData.diaChi.tenDuong}
                onChangeText={(text) =>
                  handleProfileDataChange("diaChi.tenDuong", text)
                }
                placeholder="Tên đường, số nhà"
              />
            </View>
          </View>
        </View>

        {/* Nút Cập Nhật */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            Cập Nhật
            {loading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            )}
          </Text>
        </TouchableOpacity>

        {/* --- Thay đổi mật khẩu --- */}
        <Text style={styles.sectionTitle}>Thay đổi mật khẩu</Text>
        <View style={styles.formSection}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu hiện tại"
              secureTextEntry={!isOldPasswordVisible}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity
              onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={isOldPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry={!isNewPasswordVisible}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={isNewPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry={!isConfirmNewPasswordVisible}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible)
              }
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={
                  isConfirmNewPasswordVisible
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút Đổi Mật Khẩu */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            Đổi Mật Khẩu
            {loading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            )}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#4472C4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === "android" ? 35 : 0,
    height: Platform.OS === "android" ? 75 : 55,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#4472C4",
  },
  updateAvatarButton: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
    position: "absolute",
    bottom: -10,
  },
  updateAvatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  formSection: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroupHalf: {
    flex: 1,
    marginRight: 10,
  },
  inputGroupFull: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 10,
    color: "#888",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  mapPlaceholderContainer: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  primaryButton: {
    backgroundColor: "#323660",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  picker: {
    height: 50,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  addressSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
  },
  dropdown: {
    borderColor: "#e0e0e0",
    borderRadius: 8,
    minHeight: 44,
    marginBottom: 8,
    backgroundColor: "#fafbfc",
  },
  dropdownText: { fontSize: 15, color: "#333" },
  dropdownBox: {
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});

export default EditProfileScreen;

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
  Modal,
  Switch,
} from "react-native";
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from "../servers/AddressService";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

import {
  fetchProfileData,
  updateUserInfo,
  changeUserPassword,
  uploadUserAvatar,
} from "../servers/ProfileService";
import {
  getProvinces,
  getDistricts,
  getWards,
} from "../servers/LocationService";
import { changePassword } from "../servers/AuthenticationService";
import BirthdayPicker from "./BirthdayPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfileScreen = ({ navigation, route }) => {
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

  // Địa chỉ
  const [fullDiaChi, setFullDiaChi] = useState([]); // Danh sách địa chỉ
  const [editingAddress, setEditingAddress] = useState(null); // Địa chỉ đang chỉnh sửa
  const [showAddressPanel, setShowAddressPanel] = useState(false); // Hiển thị panel thêm/sửa địa chỉ
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(profileData?.gioiTinh ?? null);
  const [genderItems, setGenderItems] = useState([
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Khác", value: "other" },
  ]);

  const [avatarUrl, setAvatarUrl] = useState(profileData?.avatarUrl);

  const defaultBirthday = "01-01-2000";
  const [ngaySinh, setNgaySinh] = useState(defaultBirthday);
const [userId, setUserId] = useState(null);

useEffect(() => {
  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(Number(id));
    } catch (e) {
      Alert.alert("Lỗi", "Không lấy được userId từ bộ nhớ.");
    }
  };
  fetchUserId();
}, []);
  // hàm chọn ảnh đại diện
  const handlePickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      try {
        const uploadedUrl = await uploadUserAvatar(userId, image);
        setAvatarUrl(uploadedUrl);
        // Cập nhật lại profileData nếu cần
        setProfileData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
      } catch (err) {
        Alert.alert("Lỗi", "Không thể upload ảnh đại diện.");
      }
    }
  };
  useEffect(() => {
    if (genderValue) {
      handleProfileDataChange("gioiTinh", genderValue);
    }
  }, [genderValue]);

  // Hàm tải dữ liệu hồ sơ
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await AsyncStorage.getItem("userId");
      if (!userId || isNaN(userId)) {
        throw new Error("Không tìm thấy userId hoặc không hợp lệ");
      }

      const data = await fetchProfileData(userId);
      setProfileData(data);
      setGenderValue(data.gioiTinh ?? null);

      // Nếu có city, tìm code tương ứng để set cho provinceValue
      if (data.diaChi?.thanhPho) {
        const provinces = await getProvinces();
        const foundProvince = provinces.find(
          (p) => p.name === data.diaChi.thanhPho
        );
        if (foundProvince) setProvinceValue(foundProvince.code);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu hồ sơ.");
      console.error("Lỗi khi tải dữ liệu trong EditProfileScreen:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    if (!profileData) return;
    // Kiểm tra dữ liệu đầu vào
    if (!profileData.fullName || !profileData.soDienThoai) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }
    const payload = {
      fullName: profileData.fullName,
      phoneNumber: profileData.soDienThoai,
      gender: profileData.gioiTinh,
      birthday: formatDateToISO(profileData.ngaySinh), // Đảm bảo đúng YYYY-MM-DD
    };
    await updateUserInfo(userId, payload);

    console.log("Payload gửi đi:", payload);
    setLoading(true);
    const success = await updateUserInfo(userId, payload);
    setLoading(false);

    if (success) {
      Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật.");
      loadProfile();
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
      const response = await changePassword(oldPassword, newPassword);
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

  // --- Hàm xử lý lưu địa chỉ ---
  const handleSaveAddress = async () => {
    if (!editingAddress) return;
    setLoading(true);

    // Ghép addressLine từ các trường nhập
    const addressLine = [
      editingAddress.tenDuong || "",
      wardItems.find((w) => w.value === wardValue)?.label ||
        editingAddress.ward ||
        "",
      districtItems.find((d) => d.value === districtValue)?.label ||
        editingAddress.district ||
        "",
    ]
      .filter(Boolean)
      .join(", ");

    const cityLabel =
      provinceItems.find((p) => p.value === provinceValue)?.label ||
      editingAddress.city ||
      "";

    const addressData = {
      userId,
      fullName: editingAddress.fullName,
      phoneNumber: editingAddress.phoneNumber,
      addressLine,
      city: cityLabel,
      isDefault: editingAddress.isDefault || false,
    };

    let success = false;
    if (editingAddress.addressId) {
      // Sửa địa chỉ
      success = await updateUserAddress(editingAddress.addressId, addressData);
    } else {
      // Thêm mới
      const result = await addUserAddress(addressData);
      success = !!result;
    }

    setLoading(false);
    setShowAddressPanel(false);
    if (success) {
      loadProfile(); // Load lại profile để cập nhật danh sách địa chỉ
      Alert.alert("Thành công", "Đã lưu địa chỉ!");
    }
  };

  const handleEditAddress = (item) => {
    setEditingAddress({
      addressId: item.id,
      fullName: item.tenNguoiNhan,
      phoneNumber: item.soDienThoaiNN,
      tenDuong: item.tenDuong ?? "",
      city: item.thanhPho, // tỉnh/thành
      district: item.huyen,
      ward: item.xa,
      isDefault: item.isDefault,
    });

    setProvinceValue(null);
    setDistrictValue(null);
    setWardValue(null);
    setShowAddressPanel(true);
  };
  // Khi chọn địa chỉ để sửa → tìm và set lại code của tỉnh
  useEffect(() => {
    if (editingAddress && provinceItems.length > 0) {
      const matchingProvince = provinceItems.find(
        (p) => p.label === editingAddress.city
      );
      if (matchingProvince) {
        setProvinceValue(matchingProvince.value);
      }
    }
  }, [editingAddress, provinceItems]);

  // Khi provinceValue đổi (tỉnh), sẽ load danh sách huyện → tìm và set lại huyện
  useEffect(() => {
    if (provinceValue) {
      getDistricts(provinceValue).then((data) => {
        setDistrictItems(data.map((d) => ({ label: d.name, value: d.code })));

        if (editingAddress?.district) {
          const matchedDistrict = data.find(
            (d) => d.name === editingAddress.district
          );
          if (matchedDistrict) setDistrictValue(matchedDistrict.code);
        } else {
          setDistrictValue(null);
        }

        setWardItems([]);
        setWardValue(null);
      });
    }
  }, [provinceValue]);

  // Khi districtValue đổi (huyện), sẽ load danh sách xã → tìm và set lại xã
  useEffect(() => {
    if (districtValue) {
      getWards(districtValue).then((data) => {
        setWardItems(data.map((w) => ({ label: w.name, value: w.code })));

        if (editingAddress?.ward) {
          const matchedWard = data.find((w) => w.name === editingAddress.ward);
          if (matchedWard) setWardValue(matchedWard.code);
        } else {
          setWardValue(null);
        }
      });
    }
  }, [districtValue]);

  // --- Hàm xử lý thay đổi địa chỉ (trong panel thêm/sửa địa chỉ) ---
  const handleEditingAddressChange = (field, value) => {
    setEditingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
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
  const handleDeleteAddress = async (addressId) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc chắn muốn xoá địa chỉ này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await deleteUserAddress(addressId);
            loadProfile();
            Alert.alert("Thành công", "Đã xoá địa chỉ.");
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xoá địa chỉ.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (error) {
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
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickAvatar}>
            <Image
              source={
                profileData.avatarUrl
                  ? { uri: profileData.avatarUrl }
                  : "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
              }
              style={styles.avatarPlaceholder}
            />
            <Text style={styles.fullNameText}>{profileData.fullName}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.updateAvatarButton}
            onPress={handlePickAvatar}
          >
            <Text style={styles.updateAvatarText}>update</Text>
          </TouchableOpacity> */}
        </View>

        {/* --- Thông tin tài khoản --- */}
        <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
        <View style={styles.formSection}>
          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              {/* <Text style={styles.inputLabel}>HỌ</Text> */}
              <TextInput
                style={styles.input}
                value={ho}
                onChangeText={(text) => handleProfileDataChange("ho", text)}
                placeholder="Nhập họ"
              />
              <DropDownPicker
                open={genderOpen}
                value={genderValue}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={setGenderValue}
                setItems={setGenderItems}
                placeholder="Chọn giới tính"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
                zIndex={5000}
                zIndexInverse={1000}
              />
            </View>
            <View style={styles.inputGroupHalf}>
              {/* <Text style={styles.inputLabel}>TÊN</Text> */}
              <TextInput
                style={styles.input}
                value={ten}
                onChangeText={(text) => handleProfileDataChange("ten", text)}
                placeholder="Nhập tên"
              />

              <BirthdayPicker
                value={profileData.ngaySinh}
                onChange={(displayDate) =>
                  handleProfileDataChange("ngaySinh", displayDate)
                }
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
              editable={false}
            />
            <TextInput
              style={styles.input}
              value={profileData.soDienThoai}
              onChangeText={(text) =>
                handleProfileDataChange("soDienThoai", text)
              }
              placeholder=""
              keyboardType="email-address"
              editable={false}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <View>
            <Text style={styles.primaryButtonText}>Cập Nhật</Text>
            {loading && <ActivityIndicator />}
          </View>
        </TouchableOpacity>

        {/* --- Địa chỉ --- */}
        <Text style={styles.sectionTitle}>Địa chỉ</Text>

        {/* Danh sách địa chỉ */}
        {Array.isArray(profileData.danhSachDiaChi) &&
          profileData.danhSachDiaChi.map((item) => (
            <View
              key={item.id}
              style={[
                styles.addressItem,
                item.isDefault && styles.selectedAddress,
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleEditAddress(item)}
              >
                <Text style={styles.addressText}>{item.fullDiaChi}</Text>
              </TouchableOpacity>
              {/* Nút Xóa */}
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => handleDeleteAddress(item.id)}
              >
                <MaterialCommunityIcons
                  name="delete-sweep"
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          ))}

        {/* Nút thêm địa chỉ mới */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setEditingAddress({
              fullName: profileData?.fullName ?? "",
              phoneNumber: profileData?.soDienThoai ?? "",
              tenDuong: "",
              city: "",
              district: "",
              ward: "",
              isDefault: false,
            });
            setProvinceValue(null);
            setDistrictValue(null);
            setWardValue(null);
            setShowAddressPanel(true);
          }}
        >
          <Text style={styles.primaryButtonText}>+ Thêm địa chỉ mới</Text>
        </TouchableOpacity>

        {/* Popup panel thêm/sửa địa chỉ */}
        {showAddressPanel && (
          <Modal
            visible={showAddressPanel}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAddressPanel(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.popupPanel}>
                {/* KHÔNG dùng ScrollView/KeyboardAwareScrollView ở đây */}
                <View style={styles.formSectionColumn}>
                  {/* Placeholder Bản đồ */}
                  <View style={styles.mapPlaceholderContainer}>
                    <Image
                      source={{ uri: profileData.mapImageUrl }}
                      style={styles.mapPlaceholder}
                    />
                  </View>
                  {/* số điện thoại nhận hàng */}
                  <Text style={styles.inputLabel}>TÊN NGƯỜI NHẬN HÀNG</Text>
                  <TextInput
                    style={styles.input}
                    value={editingAddress?.fullName || ""}
                    onChangeText={(text) =>
                      handleEditingAddressChange("tenDuong", text)
                    }
                    placeholder="tên người nhận hàng"
                  />
                  {/* số điện thoại nhận hàng */}
                  <Text style={styles.inputLabel}>SỐ ĐIỆN THOẠI NHẬN HÀNG</Text>
                  <TextInput
                    style={styles.input}
                    value={editingAddress?.phoneNumber || ""}
                    onChangeText={(text) =>
                      handleEditingAddressChange("soDienThoai", text)
                    }
                    placeholder="số điện thoại nhận hàng"
                  />
                  {/* TỈNH/THÀNH PHỐ */}
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

                  {/* QUẬN/HUYỆN */}
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

                  {/* XÃ/PHƯỜNG */}
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

                  {/* TÊN ĐƯỜNG, SỐ NHÀ */}
                  <Text style={styles.inputLabel}>TÊN ĐƯỜNG, SỐ NHÀ</Text>
                  <TextInput
                    style={styles.input}
                    value={editingAddress?.tenDuong || ""}
                    onChangeText={(text) =>
                      handleEditingAddressChange("tenDuong", text)
                    }
                    placeholder="Tên đường, số nhà"
                  />

                  {/* Đặt làm địa chỉ mặc định */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 12,
                    }}
                  >
                    <Switch
                      value={!!editingAddress?.isDefault}
                      onValueChange={(value) =>
                        handleEditingAddressChange("isDefault", value)
                      }
                    />
                    <Text style={{ marginLeft: 8, fontSize: 15 }}>
                      Đặt làm mặc định
                    </Text>
                  </View>

                  {/* Nhóm nút lưu + hủy */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.addButton, loading && styles.disabled]}
                      onPress={handleSaveAddress}
                      disabled={loading}
                    >
                      <Text style={styles.primaryButtonText}>
                        {editingAddress?.addressId ? "Cập nhật" : "Thêm mới"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowAddressPanel(false)}
                    >
                      <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Nút xóa */}
                  {editingAddress?.addressId && (
                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        { backgroundColor: "#ffdddd", marginTop: 10 },
                      ]}
                      onPress={() =>
                        handleDeleteAddress(editingAddress.addressId)
                      }
                    >
                      <Text style={{ color: "#d00", fontWeight: "bold" }}>
                        Xóa địa chỉ này
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        )}

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
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Đang đổi mật khẩu..." : "Đổi Mật Khẩu"}
            </Text>
            {loading && (
              <View style={{ marginLeft: 10 }}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </View>
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
    backgroundColor: "#f8f8f8",
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
    flex: 1,
    textAlign: "center",
    marginLeft: -20,
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
    marginLeft: 10,
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
    marginHorizontal: 10,
  },
  inputGroupFull: {
    marginBottom: 10,
    marginHorizontal: 10,
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
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
    marginHorizontal: 10,
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
    marginBottom: 4,
    backgroundColor: "#fafbfc",
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
  },
  dropdownBox: {
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  // Styles cho địa chỉ
  addressItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  addressText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  selectedAddress: {
    borderColor: "#4472C4",
    borderWidth: 2,
    backgroundColor: "#e6f0ff",
  },
  defaultLabel: {
    fontSize: 13,
    color: "#4472C4",
    fontWeight: "bold",
    marginLeft: 10,
  },
  addButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#323660",
    borderRadius: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupPanel: {
    width: "94%",
    height: "92%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: "flex-start",
  },
  formSection: {
    flex: 1,
    justifyContent: "flex-start",
  },
  mapPlaceholderContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  mapPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputGroupHalf: {
    flex: 1,
    marginHorizontal: 4,
    marginHorizontal: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
    marginBottom: 6,
    marginLeft: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  dropdown: {
    borderColor: "#e0e0e0",
    borderRadius: 8,
    minHeight: 44,
    marginBottom: 4,
    backgroundColor: "#fafbfc",
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
  },
  dropdownBox: {
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fafbfc",
    marginBottom: 4,
    marginTop: 2,
  },
  fullNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#333",
  },
  disabled: {
    opacity: 0.6,
  },
});

export default EditProfileScreen;

// Chuyển YYYY-MM-DD -> DD-MM-YYYY
const formatDateToDisplay = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};

// Chuyển DD-MM-YYYY -> YYYY-MM-DD
const formatDateToISO = (displayDate) => {
  if (!displayDate) return "";
  const [day, month, year] = displayDate.split("-");
  return `${year}-${month}-${day}`;
};

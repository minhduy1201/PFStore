import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";

const CreatePostScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [material, setMaterial] = useState("Nhựa");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [brand, setBrand] = useState("Chanel");
  const [condition, setCondition] = useState("Mới");
  const [description, setDescription] = useState("");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Giới hạn ảnh", "Bạn chỉ có thể chọn tối đa 5 ảnh.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    Alert.alert("Thông báo", "Bạn đã đăng sản phẩm!");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}></Text>

      {/* Upload Images */}
      <View style={styles.imageSection}>
        <View style={styles.imageRow}>
          {images.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.imagePreview} />
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.imageAdd} onPress={pickImage}>
              <Entypo name="plus" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.note}>
          Tải lên hình ảnh có kích thước lớn hơn 750px x 450px. Tối đa 5 ảnh.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.section}>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tiêu đề sản phẩm"
        />

        <Text style={styles.label}>Chất liệu</Text>
        <TextInput
          style={styles.input}
          value={material}
          onChangeText={setMaterial}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Giá</Text>
            <TextInput
              style={styles.input}
              value={price}
              keyboardType="numeric"
              onChangeText={setPrice}
              placeholder="0.00"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Giá sale</Text>
            <TextInput
              style={styles.input}
              value={salePrice}
              keyboardType="numeric"
              onChangeText={setSalePrice}
              placeholder="0.00"
            />
          </View>
        </View>

        <View style={styles.rowAlign}>
          <Switch
            value={isNegotiable}
            onValueChange={setIsNegotiable}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
          />
          <Text style={{ marginLeft: 10 }}>Giá có thể thương lượng?</Text>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Thương hiệu</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Tình trạng</Text>
            <TextInput
              style={styles.input}
              value={condition}
              onChangeText={setCondition}
            />
          </View>
        </View>

        <Text style={styles.label}>Mô tả chi tiết</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả sản phẩm"
          multiline
        />
      </View>

      <View style={styles.section}>
        <View style={styles.rowAlign}>
          <Switch
            value={useDefaultAddress}
            onValueChange={setUseDefaultAddress}
            trackColor={{ false: "#ccc", true: "#2196F3" }}
          />
          <Text style={{ marginLeft: 10 }}>
            Sử dụng địa chỉ được đặt trong phần hồ sơ.
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  imageAdd: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  note: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#F8F8F8",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#E0E0E0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "bold",
    color: "#333",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2C3E50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreatePostScreen;

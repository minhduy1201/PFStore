import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { loginUser } from "../../servers/AuthenticationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { Button } from "react-native";

export default function LoginScreen({ navigation }) {
  // Tạo state cho email và password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Xử lý đăng nhập
  const handleLogin = async () => {
    const res = await loginUser(email, password);
    if (res) {
      console.log("data:", res);
      await AsyncStorage.setItem("user", JSON.stringify(res.user)); // lưu user
      navigation.replace("Main"); // chuyển tới MainTabs
    }
  };

  return (
    <KeyboardWrapper>
      <View style={styles.container}>
        <View style={styles.backgroundShapes}>
          <View style={styles.shape1}></View>
          <View style={styles.shape2}></View>
          <View style={styles.shape3}></View>
        </View>

        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Chào mừng bạn quay trở lại</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D2D2D2"
          value={email} // Liên kết với state email
          onChangeText={setEmail} // Cập nhật giá trị của email
        />

        <View style={styles.view}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Mật khẩu"
            placeholderTextColor="#D2D2D2"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isVisible} //isVisible là true thì secure sẽ là false
          ></TextInput>

          <TouchableOpacity onPress={() => setIsVisible((prev) => !prev)}>
            <Feather
              name={isVisible ? "eye" : "eye-off"}
              size={24}
              color="black"
            ></Feather>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.facebookButtonText}>Đăng nhập bằng Facebook</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Bạn chưa có tài khoản ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>Đăng kí ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardWrapper>
  );
}

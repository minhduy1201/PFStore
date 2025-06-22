import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { loginUser } from "../../servers/AuthenticationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { Button } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Đảm bảo WebBrowser được đóng sau khi xác thực
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Cấu hình Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_IOS_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: '789007102059-45hasbvtg7kpmjd1f86lqmgdsv2e3s8r.apps.googleusercontent.com',
    webClientId: '789007102059-bv9ihaj0f8gg2m20f2gj0kg6gu7ubprq.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication);
    }
  }, [response]);

  // Xử lý đăng nhập
  const handleLogin = async () => {
    const res = await loginUser(email, password);
    if (res) {
      console.log("data:", res);
      await AsyncStorage.setItem("userId", res.user.userId.toString());
      navigation.replace("Main", { userId: res.user.userId });
    }
  };

  // Xử lý đăng nhập Google
  const handleGoogleSignIn = async (authentication) => {
    try {
      // Lấy thông tin user từ Google
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      });
      const userInfo = await userInfoResponse.json();

      // Lưu thông tin user vào AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        photo: userInfo.picture,
      }));

      // Chuyển đến màn hình chính
      navigation.replace("Main");
    } catch (error) {
      Alert.alert('Lỗi đăng nhập', error.toString());
      console.log('Lỗi đăng nhập Google:', error);
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
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.view}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Mật khẩu"
            placeholderTextColor="#D2D2D2"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isVisible}
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

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={() => promptAsync()}
          disabled={!request}
        >
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

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function LoginScreen({ navigation }) {
  return (
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
      />

      <TextInput 
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#D2D2D2"
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
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
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Đăng kí ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

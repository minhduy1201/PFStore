import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from './styles';

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../../assets/images/logo.jpg')} />
      <View style={styles.backgroundShapes}>
        <View style={styles.shape2}></View>
        
      </View>

      <Text style={styles.title}>Tạo tài khoản</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D2D2D2"
        />
        <TextInput 
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#D2D2D2"
          secureTextEntry
        />
        <TextInput 
          style={styles.phoneInput}
          placeholder="Số điện thoại"
          placeholderTextColor="#D2D2D2"
        />
      </View>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Bạn đã có tài khoản? <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Lấy lại mật khẩu</Text>
      <Text style={styles.subtitle}>Nhập email của bạn</Text>

      <TextInput 
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#D2D2D2"
      />

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Tiếp</Text>
      </TouchableOpacity>

      {/* 
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.logoutText}>Thoát</Text>
      </TouchableOpacity>
      */}
    </View>
  );
}

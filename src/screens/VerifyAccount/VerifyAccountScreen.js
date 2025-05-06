import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { verifyOtp } from '../../servers/AuthenticationService'; // Import AuthenticationService
import styles from './styles';

export default function VerifyAccountScreen({ route, navigation }) {
  const { email } = route.params;  // Lấy email từ navigation params
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      const response = await verifyOtp(email, otp);  // Sử dụng phương thức verifyOtp từ AuthenticationService
      if (response.message === 'Email verified successfully.') {
        // Quay lại trang đăng nhập
        Alert.alert('Thành công', 'Tài khoản của bạn đã được xác thực.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Mã xác thực không đúng. Vui lòng thử lại.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await verifyOtp(email, otp);  // Sử dụng phương thức verifyOtp từ AuthenticationService
      if (response.message === 'OTP has been resent.') {
        Alert.alert('Thành công', 'Mã OTP đã được gửi lại.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã có lỗi khi gửi lại mã OTP. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực tài khoản</Text>
      <Text style={styles.subtitle}>Nhập mã được gửi vào {'\n'}email của bạn</Text>

      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Xác Nhận</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resendText}>Gửi lại mã</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.logoutText}>Thoát</Text>
      </TouchableOpacity>
    </View>
  );
}

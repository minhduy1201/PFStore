import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { registerUser } from '../../servers/AuthenticationService'; // Import AuthenticationService
import styles from './styles';
import KeyboardWrapper from '../../components/KeyboardWrapper';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignup = async () => {
      const response = await registerUser(fullName, email, password, phoneNumber); // Sử dụng phương thức registerUser từ AuthenticationService
      if (response) {
        // Chuyển sang trang xác thực và truyền email
        navigation.navigate('VerifyAccount', { email });
      }
  };

  return (
    <KeyboardWrapper>
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../../assets/images/logo.jpg')} />
      <Text style={styles.title}>Tạo tài khoản</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#D2D2D2"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#D2D2D2"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#D2D2D2"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.phoneInput}
        placeholder="Số điện thoại"
        placeholderTextColor="#D2D2D2"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Bạn đã có tài khoản? <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
    </KeyboardWrapper>
  );
}

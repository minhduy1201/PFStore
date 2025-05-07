import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Logout } from '../servers/connection';

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Logout(navigation);
  };
  return (
   <View style={styles.container}>
         <TouchableOpacity
           style={styles.button}
           onPress={() => {
            handleLogout();
           }}
         >
           <Text style={styles.buttonText}>Đăng xuất</Text>
         </TouchableOpacity>
       </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#777',
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      width: '100%',
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  

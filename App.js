import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Screens
import LoginScreen from "./src/screens/Login/LoginScreen";
import SignupScreen from "./src/screens/Signup/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPassword/ForgotPasswordScreen";
import VerifyAccountScreen from "./src/screens/VerifyAccount/VerifyAccountScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import WishlistScreen from "./src/screens/WishlistScreen";
import PostsScreen from "./src/screens/PostsScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProductDetail from "./src/screens/ProductDetail";
import AppInfoScreen from "./src/screens/AppInfoScreen";

import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import OrderDetailsScreen from "./src/screens/OrderDetailsScreen";
import ManageOrdersScreen from "./src/screens/ManageOrdersScreen";
import FailedDeliveryDetailsScreen from "./src/screens/FailedDeliveryDetailsScreen";
import SuccessfulDeliveryDetailsScreen from "./src/screens/SuccessfulDeliveryDetailsScreen";
import ActivityScreen from "./src/screens/ActivityScreen";
import TransactionHistoryScreen from "./src/screens/TransactionHistoryScreen";

import EditProfileScreen from "./src/screens/EditProfileScreen";
import ProductByCategory from "./src/screens/ProductByCategory";

import SearchProductsScreen from "./src/screens/SearchProductsScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";

// import SettingsScreen from './src/screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const OrdersStack = createNativeStackNavigator(); // New Stack Navigator for Orders flow

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="Cart" component={CartScreen} />
      <OrdersStack.Screen name="Checkout" component={CheckoutScreen} />
      <OrdersStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <OrdersStack.Screen name="ManageOrders" component={ManageOrdersScreen} />
      <OrdersStack.Screen
        name="FailedDeliveryDetails"
        component={FailedDeliveryDetailsScreen}
      />
      <OrdersStack.Screen
        name="SuccessfulDeliveryDetails"
        component={SuccessfulDeliveryDetailsScreen}
      />
      <OrdersStack.Screen
        name="TransactionHistory"
        component={ActivityScreen}
      />
    </OrdersStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Wishlist":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Post":
              iconName = focused ? "reader" : "reader-outline";
              break;
            case "Orders":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? "#2f80ed" : "#4f4f4f"}
            />
          );
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#fff",
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Post" component={PostsScreen} />
      <Tab.Screen name="Orders" component={OrdersStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="AppInfo" component={AppInfoScreen} />
        <Stack.Screen name="ProductByCat" component={ProductByCategory} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          styles={styles.safeArea}
        />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen
          name="FailedDeliveryDetails"
          component={FailedDeliveryDetailsScreen}
        />
        <Stack.Screen
          name="SuccessfulDeliveryDetails"
          component={SuccessfulDeliveryDetailsScreen}
        />
        <Stack.Screen name="Activity" component={ActivityScreen} />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistoryScreen}
        />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="SearchProducts" component={SearchProductsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    height: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

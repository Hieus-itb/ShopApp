import React, { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView ,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuList from '../components/MenuListComponent';
export default function ProfileSettings({ navigation }) {
  const [user, setUser] = useState({
    avatar: "",
    username: "",
    date: "",
    gender: "",
    phone: "",
    email: ""
  });
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', () => {
      async function loadUser() {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        // Lấy số lượng đơn hàng
        const orderData = await AsyncStorage.getItem('orderHistory');
        if (orderData) {
          setOrderCount(JSON.parse(orderData).length);
        } else {
          setOrderCount(0);
        }
      }
      loadUser();
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      {/* Photo */}
      <View style={styles.photoContainer}>
        <Image   source={user.avatar ? { uri: user.avatar } : require("../img/apple.png")} style={styles.profilePhoto} />
      </View>

      {/* Name + Email */}
      <View style={styles.nameEmailContainer}>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Activity */}
      <View style={styles.activityContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <View style={{
            backgroundColor: '#FE8C00',
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 2,
            marginLeft: 8,
            minWidth: 32,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{orderCount}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.orderHistoryBtn}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.orderHistoryText}>View Order History</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Profile</Text>
        {/* Menu List */}
        <MenuList
          title="Personal Data"
          onPress={() => navigation.navigate('PersonalData')}
          icon="person"
        />
        <MenuList 
          title="Settings"
          icon="settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <MenuList title="Extra Card" icon="card" onPress={() => alert("Coming soon")}/>
        <MenuList title="Delivery Address" icon="location" onPress={() => navigation.navigate('Address Settings')} />
      </View>

      {/* Support Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Support</Text>
        {/* Menu List */}
        <MenuList title="Help Center" icon="help-circle" />
        <MenuList title="Request Account Deletion" icon="trash" />
        
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={async () => {
        Alert.alert(
          "Đăng Xuất",
          "Bạn chắc chắn rằng đăng xuất?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "OK", onPress: async () => {
                await AsyncStorage.removeItem('user');
                navigation.replace('Login');
              }
            }
          ],
          { cancelable: false }
        );
      }}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  nameEmailContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#878787',
  },
  activityContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#878787',
    marginBottom: 5,
  },
  menuSection: {
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#F14141',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 100,
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderList: {
    marginTop: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderPrice: {
    fontSize: 14,
    color: '#FE8C00',
  },
  orderItems: {
    fontSize: 12,
    color: '#878787',
  },
  orderStatus: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#FE8C00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 30,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
  },
  orderHistoryBtn: {
    marginTop: 10,
    backgroundColor: '#FE8C00',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  orderHistoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
});
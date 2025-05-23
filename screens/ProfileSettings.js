import React, { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView ,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuList from '../components/MenuListComponent';
import { getOrdersByUserId } from "../API/api";
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
        try{
          const orderData = await getOrdersByUserId(JSON.parse(userData).id);
          if (orderData) {
            setOrderCount(orderData.length);
          } else {
            setOrderCount(0);
          }
        }catch (error) {
        }
        
      }
      loadUser();
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.photoContainer}>
        <Image   source={user.avatar ? { uri: user.avatar } : require("../img/apple.png")} style={styles.profilePhoto} />
      </View>

      <View style={styles.nameEmailContainer}>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.activityContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
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
          <Text style={styles.orderHistoryText}>Xem lịch sử đơn hàng</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Cá nhân</Text>
        <MenuList
          title="Thông tin cá nhân"
          onPress={() => navigation.navigate('PersonalData')}
          icon="person"
        />
        <MenuList 
          title="Cài đặt"
          icon="settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <MenuList title="Thẻ phụ" icon="card" onPress={() => alert("Tính năng sắp ra mắt")} />
        <MenuList title="Địa chỉ giao hàng" icon="location" onPress={() => navigation.navigate('Address Settings')} />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Hỗ trợ</Text>
        <MenuList title="Trung tâm trợ giúp" icon="help-circle" />
        <MenuList title="Yêu cầu xóa tài khoản" icon="trash" />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={async () => {
        Alert.alert(
          "Đăng xuất",
          "Bạn có chắc chắn muốn đăng xuất?",
          [
            {
              text: "Hủy",
              style: "cancel"
            },
            {
              text: "Đồng ý", onPress: async () => {
                await AsyncStorage.removeItem('user');
                await AsyncStorage.removeItem('selectedAddress');
                navigation.replace('Login');
              }
            }
          ],
          { cancelable: false }
        );
      }}>
        <Text style={styles.signOutButtonText}>Đăng xuất</Text>
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
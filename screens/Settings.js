import React, { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,Platform, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuList from '../components/MenuListComponent';
import CustomSwitch from '../components/CustomSwitch';
import LocationAccess from '../hooks/LocationAccess'; 
import InformAccess from '../hooks/InformAccess';

import LanguagePicker from '../components/LanguagePicker';


export default function Settings({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isModalVisible, setModalVisible] = useState(false);
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const [user, setUser] = useState({
          avatar: "",
          username: "",
          date: "",
          gender: "",
          phone: "",
          email: ""
      });
  
    useEffect(() => {
      navigation.addListener('focus', () => {
        async function loadUser() {
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
        loadUser();
      });
    }, [navigation]);

    const { isAllowed, handleToggle } = LocationAccess();
    const { isInform, handleInform } = InformAccess(); 
  return (
    <ScrollView style={styles.container}>
    
      {/* PROFILE Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>THÔNG TIN</Text>
        <View style={styles.menuItem}>
          <View style={styles.menuItemRow}>
            <Text style={styles.menuItemText}>Thông báo đẩy</Text>
            <CustomSwitch initial={isInform} onToggle={handleInform} />
          </View>
        </View>
        <View style={styles.menuItem}>
          <View style={styles.menuItemRow}>
            <Text style={styles.menuItemText}>Vị trí</Text>
            <CustomSwitch initial={isAllowed} onToggle={handleToggle} />
          </View>
        </View>
        <MenuList title="Ngôn ngữ" onPress={() => setModalVisible(true)} rightText={selectedLanguage} />
      </View>
      <LanguagePicker
        isShow={isModalVisible}
        onClose={() => setModalVisible(false)}
        onLanguageChange={handleLanguageChange}
      />
      {/* OTHER Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>KHÁC</Text>
        <MenuList title="Giới thiệu" />
        <MenuList title="Chính sách bảo mật"/>
        <MenuList title="Điều khoản sử dụng"/>
      </View>
      {/* Sign Out Button */}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#878787',
  },
  
  sectionTitle: {
    fontSize: 12,
    color: '#878787',
    marginBottom: 5,
  },
  menuSection: {
    marginBottom: 20,
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
    paddingRight: 10, // Add padding to the right
  },
  menuItemText: {
    fontSize: 16,
  },
 
  
});
import React, { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

const InformAccess = () => {
  const [isAllowed, setIsAllowed] = useState(false);

  const requestNotificationPermission = async () => {
    try {
      console.log('Yêu cầu quyền thông báo...');
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      console.log('Trạng thái quyền:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền thông báo:', error);
      return false;
    }
  };

  const handleToggle = async (newValue) => {
    console.log('Toggle thông báo:', newValue);
    if (newValue) {
      const granted = await requestNotificationPermission();
      if (granted) {
        try {
          if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          }
          const token = await Notifications.getExpoPushTokenAsync();
          console.log('Token thông báo:', token);
          setIsAllowed(true);
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể đăng ký thông báo');
          setIsAllowed(false);
        }
      } else {
        Alert.alert('Từ chối quyền', 'Bạn không cho phép gửi thông báo');
        setIsAllowed(false);
      }
    } else {
      setIsAllowed(false);
    }
  };

  return { isAllowed, handleToggle };
};

export default InformAccess;
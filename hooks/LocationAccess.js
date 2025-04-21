import React, { useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

const LocationAccess = () => {
  const [isAllowed, setIsAllowed] = useState(false);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền vị trí:', error);
      return false;
    }
  };

  const handleToggle = async (newValue) => {
    if (newValue) {
      const granted = await requestLocationPermission();
      if (granted) {
        try {
          const position = await Location.getCurrentPositionAsync({});
          console.log('Vị trí:', position);
          setIsAllowed(true);
        } catch (error) {
          Alert.alert('Lỗi', 'Không lấy được vị trí');
          setIsAllowed(false);
        }
      } else {
        Alert.alert('Từ chối quyền', 'Bạn không cho phép truy cập vị trí');
        setIsAllowed(false);
      }
    } else {
      setIsAllowed(false);
    }
  };

  return { isAllowed, handleToggle };
};

export default LocationAccess;
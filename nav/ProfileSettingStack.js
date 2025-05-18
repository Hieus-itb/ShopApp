// nav/ProfileSettingsStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileSettings from '../screens/ProfileSettings';
import PersonalData from '../screens/PersonalData';
import Settings from '../screens/Settings';
import DeliverySetting from '../screens/DeliverySetting';
const Stack = createStackNavigator();

export default function ProfileSettingsStack() {
  return (
    <Stack.Navigator
        screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
            elevation: 0,          // Android
            shadowOpacity: 0,      // iOS
            borderBottomWidth: 0,  // Cả hai
            backgroundColor: '#fff', // Tùy chọn nếu muốn header trắng
        },
        }}
  >
      <Stack.Screen name="ProfileSettingsMain" component={ProfileSettings} 
        options={{
            title: 'Profile Settings',
            headerShown: true,
          }}
      />
      <Stack.Screen name="PersonalData" 
        component={PersonalData} 
        options={{
            title: 'Personal Data',
            headerShown: true,
          }}
      />
      <Stack.Screen name="Settings" component={Settings} 
        options={{
            title: 'Settings',
            headerShown: true,
          }}
        />
      <Stack.Screen name="Address Settings" component={DeliverySetting} 
      options={{
          title: 'Settings',
          headerShown: true,
        }}
      />

    </Stack.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import CartStack from './CartStack';
import Cart from '../screens/cart';
// import Favorite from '../screens/favorite';

import ProfileSettingsStack from './ProfileSettingStack';
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FF7F00',
                tabBarInactiveTintColor: '#aaa',
                tabBarStyle: {
                    height: 40,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: '#fff',
                },
                tabBarIcon: ({ color }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Cart') iconName = 'cart';
                    // else if (route.name === 'Favorite') iconName = 'heart';
                    else if (route.name === 'Profile') iconName = 'person';
                    else if (route.name === 'ProfileSettings') iconName = 'settings';

                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Cart" component={CartStack} options={{ headerShown: false }} />
            <Tab.Screen name="ProfileSettings" component={ProfileSettingsStack} />

        </Tab.Navigator>
    );
}

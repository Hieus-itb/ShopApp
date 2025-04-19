import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';

import Cart from '../screens/cart';
// import Favorite from '../screens/favorite';
import Profile from '../screens/profile';
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

                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Cart" component={Cart} />
            {/* <Tab.Screen name="Favorite" component={Favorite} /> */}
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

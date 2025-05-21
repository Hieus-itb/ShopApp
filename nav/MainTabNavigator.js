import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeStack from './HomeStack';
import CartStack from './CartStack';
import ProfileSettingsStack from './ProfileSettingStack';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const [cartCount, setCartCount] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            const fetchCartCount = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user');
                    if (!userData) {
                        setCartCount(0);
                        return;
                    }
                    const user = JSON.parse(userData);
                    const email = user.email;
                    const cartFileUri = FileSystem.documentDirectory + "cart.json";
                    const fileInfo = await FileSystem.getInfoAsync(cartFileUri);
                    if (!fileInfo.exists) {
                        setCartCount(0);
                        return;
                    }
                    const content = await FileSystem.readAsStringAsync(cartFileUri);
                    const carts = JSON.parse(content);
                    const userCart = carts[email] || [];
                    const totalCount = userCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                    setCartCount(totalCount);
                } catch (e) {
                    setCartCount(0);
                }
            };
            fetchCartCount();
        }, [])
    );
 
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
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ unmountOnBlur: true }}
            />
            <Tab.Screen
                name="Cart"
                component={CartStack}
                options={{
                    headerShown: false,
                    unmountOnBlur: true,
                    tabBarBadge: cartCount > 0 ? cartCount : null,
                    tabBarBadgeStyle: { backgroundColor: 'red', color: 'white' }
                }}
            />
            <Tab.Screen name="ProfileSettings" component={ProfileSettingsStack} />

        </Tab.Navigator>
    );
}

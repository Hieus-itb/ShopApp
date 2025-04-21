// nav/CartStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../screens/cart'; 
import Payment from '../screens/Payment';

const Stack = createStackNavigator();

export default function CartStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CartDetails" component={Cart} />
            <Stack.Screen name="Payment" component={Payment} />
        </Stack.Navigator>
    );
}

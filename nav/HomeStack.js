// nav/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home';
import SearchScreen from '../screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons';
import About from '../screens/About';
const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="HomeMain" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen}
        options={({ navigation }) => ({
          headerTitle: 'Search Food',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons
              name="arrow-back-circle-outline"
              size={32}
              color="#000"
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          headerTitle: 'Chi tiet san pham',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

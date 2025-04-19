import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategories, getProductsByCategory } from '../data/productService';
import CategoryList from '../components/CategoryList';
export default function Search({ navigation }) {
    const recentSearches = ['Burgers', 'Fast food', 'Dessert', 'French', 'Pastry'];
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('burger');
    const [showCategoryList, setShowCategoryList] = useState(false);

    useEffect(() => {
        const fetchedCategories = getCategories();
        setCategories(fetchedCategories);
    }, []);
   
    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        
        setShowCategoryList(false);
    };
    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity style={[styles.categoryButton, selectedCategory === item.id && styles.categoryButtonSelected]}
        onPress={() => handleSelectCategory(item.id)}>
            <View style={styles.categoryContent}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );
    
    
    return (
        <View style={styles.container}>
            {/* Search Box */}
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#aaa" />
                    <TextInput placeholder="Search Food" style={styles.input} />
                    <Ionicons name="options-outline" size={20} color="#aaa" />
                 </View>
            {/* Category Modal */}
             
            <CategoryList
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleSelectCategory}
                    />
          {/* Recent Searches */}
          <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent searches</Text>
          <TouchableOpacity><Text style={styles.deleteText}>Delete</Text></TouchableOpacity>
        </View>
        {recentSearches.map((item, index) => (
          <View key={index} style={styles.recentItem}>
            <Ionicons name="search" size={16} color="#aaa" />
            <Text style={{ flex: 1 }}>{item}</Text>
            <Ionicons name="close" size={16} color="#aaa" />
          </View>
        ))}
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My recent orders</Text>
        {[1, 2].map((_, index) => (
          <View key={index} style={styles.orderItem}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5787/5787031.png' }}
              style={styles.orderImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.orderTitle}>Ordinary Burgers</Text>
              <Text style={styles.orderSub}>Burger Restaurant</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={{ marginHorizontal: 5 }}>4.9</Text>
                <Ionicons name="location-outline" size={14} color="#aaa" />
                <Text>190m</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
      paddingTop: 48,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 40,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      marginHorizontal: 8,
    },
    categories: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    categoryItem: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#eee',
      borderRadius: 20,
      marginRight: 10,
    },
    activeCategory: {
      backgroundColor: '#FFB800',
    },
    section: {
      marginTop: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    deleteText: {
      color: 'orange',
    },
    recentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 10,
    },
    orderItem: {
      flexDirection: 'row',
      marginTop: 10,
      gap: 10,
    },
    orderImage: {
      width: 60,
      height: 60,
      borderRadius: 10,
    },
    orderTitle: {
      fontWeight: 'bold',
    },
    orderSub: {
      color: '#888',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
   
  });
  
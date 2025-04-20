import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { getCategories } from '../data/productService';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    categoryButton: {
        backgroundColor: '#f2f2f2',
        borderRadius: 15,
        width: 60,
        height: 60,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,

    },
    categoryButtonSelected: { backgroundColor: '#FE8C00'},
    categoryIcon: { fontSize: 24 },
    categoryContent: { justifyContent: 'center', alignItems: 'center' },
    categoryName: { fontSize: 12, fontWeight: 'bold', marginTop: 5, color: '#888' },
});

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
    const categories = getCategories();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item.id && styles.categoryButtonSelected]}
            onPress={() => onSelectCategory(item.id)}
        >
            <View style={styles.categoryContent}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={[
                    styles.categoryName,
                    selectedCategory === item.id && { color: '#fff' }
                ]}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

export default CategoryList;
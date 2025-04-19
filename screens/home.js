import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ImageBackground, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { getCategories, getProductsByCategory } from '../data/productService';
import { imageMap } from '../data/imageMap';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('burger');
    const [products, setProducts] = useState([]);
    const [location, setLocation] = useState("New York, USA");
    const [showLocationList, setShowLocationList] = useState(false);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [locations] = useState([
        "New York, USA", "Los Angeles, USA", "Chicago, USA", "San Francisco, USA",
        "Miami, USA", "Boston, USA", "Washington, USA", "Dallas, USA", "Austin, USA", "Seattle, USA"
    ]);
    const navigation = useNavigation();
    useEffect(() => {
        const fetchedCategories = getCategories();
        setCategories(fetchedCategories);
        setProducts(getProductsByCategory(selectedCategory));
    }, []);

    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        setProducts(getProductsByCategory(categoryId));
        setShowCategoryList(false);
    };

    const handleSelectLocation = (loc) => {
        setLocation(loc);
        setShowLocationList(false);
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item.id && styles.categoryButtonSelected]}
            onPress={() => handleSelectCategory(item.id)}
        >
            <View style={styles.categoryContent}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderProductItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('About', { product: item })} style={styles.productCard}>
            <Image source={imageMap[item.image] || imageMap["default"]} style={styles.productImage} />
            <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={18} color="#FF7F00" />
            </TouchableOpacity>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.rowInfo}>
                <Text style={styles.productInfo}>⭐ {item.rating}</Text>
                <Text style={styles.productInfo}>📍 {item.distance}</Text>
            </View>
            <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/burger1.jpg')} style={styles.headerBackground}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.locationText}>Your Location</Text>
                        <TouchableOpacity onPress={() => setShowLocationList(true)}>
                            <View style={styles.locationRow}>
                                <Entypo name="location-pin" size={18} color="#fff" />
                                <Text style={styles.cityText}>{location}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerIcons}>
                        {/*Chức năng tìm kiếm và thông báo (Chưa làmlàm) */}
                        <Ionicons name="search" size={22} color="#fff" style={styles.icon} />
                        <Ionicons name="notifications-outline" size={22} color="#fff" />
                    </View>
                </View>
                <Text style={styles.mainTitle}>Provide the best food for you</Text>
            </ImageBackground>

            <Modal transparent visible={showLocationList} animationType="slide">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowLocationList(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <FlatList
                        data={locations}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.locationItem} onPress={() => handleSelectLocation(item)}>
                                <Text style={styles.locationText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.locationList}
                    />
                </View>
            </Modal>

            {/* Category Modal */}
            <Modal transparent visible={showCategoryList} animationType="slide">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCategoryList(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCategoryItem}
                        numColumns={4}
                        contentContainerStyle={styles.categoryGrid}
                    />
                </View>
            </Modal>

            <View style={styles.contentArea}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.title}>Find by Category</Text>
                    <TouchableOpacity onPress={() => setShowCategoryList(true)}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCategoryItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryList}
                />

                <FlatList onPress={() => navigation.navigate('About', { product: item })}
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={renderProductItem}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerBackground: { height: 280, paddingTop: 50, paddingHorizontal: 20 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    locationText: { fontSize: 12, color: '#333' },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    cityText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    headerIcons: { flexDirection: 'row', gap: 10 },
    mainTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20, width: '80%' },
    contentArea: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    seeAll: { color: '#FF7F00', fontSize: 14 },
    categoryList: { marginVertical: 10, paddingBottom: 20 },
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
    categoryButtonSelected: { backgroundColor: '#FF7F00' },
    categoryIcon: { fontSize: 24 },
    categoryContent: { justifyContent: 'center', alignItems: 'center' },
    categoryName: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
    productList: { paddingTop: 10, paddingBottom: 20 },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        paddingTop: 40,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        margin: 5,
        width: '46%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        position: 'relative',
    },
    productImage: { width: '100%', height: 100, borderRadius: 10 },
    heartIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 4,
    },
    productName: { fontWeight: 'bold', marginTop: 8, fontSize: 14 },
    rowInfo: { flexDirection: 'row', justifyContent: 'space-between' },
    productInfo: { fontSize: 12, color: '#888' },
    productPrice: { marginTop: 5, fontWeight: 'bold', color: '#FF7F00' },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginTop: '30%',
        maxHeight: '60%',
        elevation: 10,
    },
    locationItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    closeButton: { position: 'absolute', top: 10, right: 10 },
    locationList: { marginTop: 40 },
});

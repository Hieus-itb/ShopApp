import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ImageBackground, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { getCategories, getProductsByCategory } from '../data/productService';
import { useNavigation } from '@react-navigation/native';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';

export default function Home({ navigation }) {
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
    useEffect(() => {
        const fetchedCategories = getCategories();
        setCategories(fetchedCategories);
        setProducts(getProductsByCategory(selectedCategory));
    }, [selectedCategory]);

    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        setProducts(getProductsByCategory(categoryId));
        setShowCategoryList(false);
    };

    const handleSelectLocation = (loc) => {
        setLocation(loc);
        setShowLocationList(false);
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/image34.png')} style={styles.headerBackground}>
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
                        <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconWrapper}>
                            <Ionicons name="search" size={22} color="#fff" style={styles.icon} />
                        </TouchableOpacity>
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
                    <CategoryList
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleSelectCategory}
                    />
                </View>
            </Modal>

            <View style={styles.contentArea}>
                <View>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.title}>Find by Category</Text>
                        <TouchableOpacity onPress={() => setShowCategoryList(true)}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <CategoryList
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleSelectCategory}
                    />
                </View>
                <ProductList products={products} navigation={navigation} />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerBackground: { height: 280, paddingTop: 50, paddingHorizontal: 20 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    locationText: { fontSize: 12, color: '#fff' },
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

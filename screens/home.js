import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ImageBackground, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import { getCategories, getProductsByCategory, getAddressesByUserId} from '../API/api';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('burger');
    const [products, setProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressList, setShowAddressList] = useState(false);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const PAGE_SIZE = 6;
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedCategories = await getCategories();
            const fetchedProducts = await getProductsByCategory(selectedCategory);

            setCategories(fetchedCategories);
            setProducts(fetchedProducts);
            setVisibleCount(PAGE_SIZE);
        };

         fetchData();
    }, [selectedCategory, navigation]);


    const handleSelectCategory = async (categoryId) => {
    setSelectedCategory(categoryId);
    const fetchedProducts = await getProductsByCategory(categoryId);
    setProducts(fetchedProducts);
    setShowCategoryList(false);
};

    // Lấy địa chỉ từ AsyncStorage va api
    useFocusEffect(
        React.useCallback(() => {
            const fetchAddresses = async () => {
                try {
                    const data = await AsyncStorage.getItem('user');
                    if (data) {
                        const user = JSON.parse(data);
                        const addressList = await getAddressesByUserId(user.id);
                        setAddresses(addressList);

                        const selected = await AsyncStorage.getItem('selectedAddress');
                        if (selected) {
                            setSelectedAddress(JSON.parse(selected));
                        } else {
                            setSelectedAddress(addressList[0] || null);
                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy địa chỉ người dùng:", error.message);
                }
            };
            fetchAddresses();
        }, [])
    );

    const handleSelectAddress = (addr) => {
        setSelectedAddress(addr);
        setShowAddressList(false);
    };

    const handleLoadMore = () => {
        if (visibleCount < products.length) {
            setVisibleCount(prev => prev + PAGE_SIZE);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/image34.png')} style={styles.headerBackground}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.locationText}>Địa chỉ giao hàng</Text>
                        <TouchableOpacity onPress={() => setShowAddressList(true)}>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={18} color="#fff" />
                                <Text style={styles.cityText}>
                                    {selectedAddress
                                        ? `${selectedAddress.street}, ${selectedAddress.state}, ${selectedAddress.city}`
                                        : "Chọn địa chỉ"}
                                </Text>
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

            {/* Modal chọn địa chỉ */}
            <Modal transparent visible={showAddressList} animationType="slide">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddressList(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Chọn địa chỉ giao hàng</Text>
                
                    {addresses.length === 0 ? (
                        <Text style={{ color: '#888', marginTop: 40 }}>Chưa có địa chỉ. Vui lòng thêm địa chỉ trong hồ sơ.</Text>
                    ) : (
                        <FlatList
                            data={addresses}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 12,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#eee',
                                        backgroundColor: selectedAddress === item ? '#FFF7F0' : '#fff'
                                    }}
                                    onPress={async () => {
                                            setSelectedAddress(item);
                                            await AsyncStorage.setItem('selectedAddress', JSON.stringify(item));
                                            setShowAddressList(false);
                                        }}
                                >
                                    {/* Nút tròn radio */}
                                    <View style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: '#FE8C00',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 10,
                                    }}>
                                        {selectedAddress === item && (
                                            <View style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: '#FE8C00',
                                            }} />
                                        )}
                                    </View>
                                    <Text style={{ color: '#222', fontWeight: selectedAddress === item ? 'bold' : 'normal' }}>
                                        {item.street}, {item.state}, {item.city}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={styles.locationList}
                        />
                    )}
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
                <ProductList
                    products={products.slice(0, visibleCount)}
                    navigation={navigation}
                    onLoadMore={handleLoadMore}
                    canLoadMore={visibleCount < products.length}
                />
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
    loadMoreBtn: {
        marginVertical: 16,
        alignSelf: 'center',
        backgroundColor: '#FF7F00',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    loadMoreText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

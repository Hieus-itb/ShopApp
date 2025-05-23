import React, { useState, useEffect  } from 'react';
import { View, Text, FlatList, StyleSheet,ScrollView, Image } from 'react-native';
import { getCategories, getProductsBySearch, getProducts } from '../API/api';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { getRecentProducts, getProductsByCategory } from '../API/api';
import SearchBar  from '../components/SearchBar';
import ProductList from '../components/ProductList';
import CenteredItemView from '../components/CenteredItemView';

export default function Search({ navigation }) {
  
    const [categories ,setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('burger');
    const [showCategoryList,setShowCategoryList]= useState(false);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [recentProducts, setRecentProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
            setFilteredProducts(null);
            const fetchedRecentProducts = await getRecentProducts();
            setRecentProducts(fetchedRecentProducts);
        };
        fetchData();
    }, []);

    const [allProducts, setAllProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setAllProducts(data);
        };
        fetchProducts();
    }, []);

    const productNames = allProducts.map((p) => p.name);
    const categoryNames = categories.map((c) => c.name);
    const suggestionWords = Array.from(new Set([...productNames, ...categoryNames]));

    const handleSelect = async (word) => {
      if (!word || typeof word !== 'string') return; 
      word = word.trim().toLowerCase();
      setFilteredProducts(null);
      const isCategory = categoryNames.some(categoryName => categoryName.toLowerCase() === word);
      let products = [];

      if (isCategory) {
        products = await getProductsByCategory(word);
      } else {
        products = await getProductsBySearch(word);
      }
      if (products.length === 0) {
        setFilteredProducts([]);
      } else {
        setFilteredProducts(products);
      }
    };

   
    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowCategoryList(false);
    };
    
  const ListHeader = () => (
    <View>
      {/* Search Box */}
      <View>
        <SearchBar suggestions={suggestionWords} onSelect={handleSelect} />
      </View>

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        style={{ marginTop: 16, marginBottom: 16 }}
      />
    </View>
  );

  const ListFooter = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sản phẩm mới nhất</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row' , gap: 10}}>
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigation={navigation}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
  const CenteredImageView = () => {
    return (
      <View style={styles.centeredContainer}>
        <Image
          source={require("../img/not-found-img.png")}
          style={styles.mainImage}
        />
        <Text style={styles.mainTitle}>Không tìm thấy kết quả nào!</Text>
        <Text style={styles.mainSubtitle}>
          Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc thử một từ khóa khác.
        </Text>
      </View>
    );
  };
  return (
    <FlatList
      style={styles.container}
      data={filteredProducts || []}
      key={filteredProducts ? 'products' : 'empty'}
      keyExtractor={(product) => product.id}
      renderItem={({ item: product }) => (
        <ProductCard
          key={product.id}
          product={product}
          navigation={navigation}
        />
      )}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={() => (
        <CenteredItemView
          ImageSrc={require("../img/not-found-img.png")}
          mainTitle="Không tìm thấy kết quả nào!"
          mainSubtitle="Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc thử một từ khóa khác."
        />
      )}
    />
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
    
    activeCategory: {
      backgroundColor: '#FFB800',
    },
    section: {
      marginTop: 10,
      marginBottom: 100,
      
    },
    
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
   

   
  });
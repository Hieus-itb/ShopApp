import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,ScrollView } from 'react-native';
import { getCategories, getProductsBySearch, getProducts } from '../data/productService';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { getRecentProducts } from '../data/productService';
import SearchBar  from '../components/SearchBar';
import ProductList from '../components/ProductList';


export default function Search({ navigation }) {
    const recentSearches = ['Burgers', 'Fast food', 'Dessert', 'French', 'Pastry'];
    const [categories ,setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('burger');
    const [showCategoryList,setShowCategoryList]= useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const recentProducts = getRecentProducts();
    useEffect(() => {
        const fetchedCategories = getCategories();
        setCategories(fetchedCategories);
    }, []);

    const data = getProducts();
    const productNames = data.map((p) => p.name);
    const categoryNames = categories.map((c) => c.name);
    const suggestionWords = Array.from(new Set([...productNames, ...categoryNames]));

    const handleSelect = (word) => {
      const products = getProductsBySearch(word);
      setFilteredProducts(products);
    };

   
    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        
        setShowCategoryList(false);
    };
    
    return (
        <ScrollView style={styles.container}>
            {/* Search Box */}
            <View >
              <SearchBar suggestions={suggestionWords} onSelect={handleSelect} />
            </View>

            <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                style={{marginTop: 16, marginBottom: 16}}
            />
        {filteredProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <ProductList products={filteredProducts} navigation={navigation} />
          </View>
        )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Newest Product </Text>
        <FlatList
          data={recentProducts}
          keyExtractor={(product) => product.id}
          renderItem={({ item: product }) => (
            <ProductCard
              key={product.id}
              product={product}
              navigation={navigation}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
    </ScrollView>
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
      marginTop: 16,
    },
    
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
   
    
    
   
  });
  
import data from './products.json';

export const getCategories = () => {
    return data.categories;
};

export const getProducts = () => {
    return data.products;
};

export const getProductsBySearch = (searchTerm) => {
    return data.products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getProductsByCategory = (categoryId) => {
    return data.products.filter((p) => p.category === categoryId);
};

export const getProductById = (productId) => {
    return data.products.find((p) => p.id === productId);
};

export const getRecentProducts = (count = 2) => {
    return [...data.products]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, count);
};


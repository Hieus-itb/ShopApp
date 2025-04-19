import data from './products.json';

export const getCategories = () => {
    return data.categories;
};

export const getProductsByCategory = (categoryId) => {
    return data.products.filter((p) => p.category === categoryId);
};

export const getProductById = (productId) => {
    return data.products.find((p) => p.id === productId);
};


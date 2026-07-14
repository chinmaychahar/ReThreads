import { API_BASE_URL } from '../../config/api';

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: 'PRODUCTS_LOADING' });
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?limit=50`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    dispatch({ type: 'PRODUCTS_SUCCESS', payload: data.products });
  } catch (err) {
    dispatch({ type: 'PRODUCTS_ERROR', payload: 'Failed to load products' });
  }
};

export const fetchFeaturedProducts = () => async (dispatch) => {
  dispatch({ type: 'PRODUCTS_LOADING' });
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/featured`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    dispatch({ type: 'PRODUCTS_FEATURED_SUCCESS', payload: data.products });
  } catch (err) {
    dispatch({ type: 'PRODUCTS_ERROR', payload: 'Failed to load featured products' });
  }
};

export const fetchProductsByCategory = (category) => async (dispatch) => {
  dispatch({ type: 'PRODUCTS_LOADING' });
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/category/${category}?limit=50`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    dispatch({ type: 'PRODUCTS_SUCCESS', payload: data.products });
  } catch (err) {
    dispatch({ type: 'PRODUCTS_ERROR', payload: 'Failed to load products' });
  }
};

export const fetchProductById = (id) => async (dispatch) => {
  dispatch({ type: 'PRODUCT_DETAIL_LOADING' });
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    dispatch({ type: 'PRODUCT_DETAIL_SUCCESS', payload: data });
  } catch (err) {
    dispatch({ type: 'PRODUCTS_ERROR', payload: 'Product not found' });
  }
};

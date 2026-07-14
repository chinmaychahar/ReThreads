const initialState = {
  items: [],
  featured: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTS_LOADING':
      return { ...state, loading: true, error: null };
    case 'PRODUCTS_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'PRODUCTS_FEATURED_SUCCESS':
      return { ...state, loading: false, featured: action.payload };
    case 'PRODUCTS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'PRODUCT_DETAIL_LOADING':
      return { ...state, loading: true, currentProduct: null, error: null };
    case 'PRODUCT_DETAIL_SUCCESS':
      return { ...state, loading: false, currentProduct: action.payload };
    default:
      return state;
  }
};

export default productsReducer;

const initialState = {
  items: [],
  loading: false,
  syncing: false,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return { ...state, loading: true };
    case 'CART_SET':
      return { ...state, loading: false, syncing: false, items: action.payload };
    case 'CART_SYNCING':
      return { ...state, syncing: true };
    case 'CART_ADD_LOCAL':
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    case 'CART_REMOVE_LOCAL':
      return { ...state, items: state.items.filter((i) => i.productId !== action.payload) };
    case 'CART_CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export default cartReducer;

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, loading: false, user: null, error: null };
    default:
      return state;
  }
};

export default authReducer;

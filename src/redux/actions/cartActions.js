import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

async function getAuthHeaders() {
  try {
    const jwt = await account.createJWT();
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt.jwt}` };
  } catch {
    return null;
  }
}

export const fetchCart = () => async (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.user) return;

  dispatch({ type: 'CART_LOADING' });
  try {
    const headers = await getAuthHeaders();
    if (!headers) return;
    const res = await fetch(`${API_BASE_URL}/api/cart`, { headers });
    if (res.ok) {
      const data = await res.json();
      dispatch({ type: 'CART_SET', payload: data.items });
    }
  } catch (err) {
    // Keep local cart on API failure
  }
};

export const addToCart = (product) => async (dispatch, getState) => {
  const cartItem = {
    productId: product.$id || product.id,
    title: product.title,
    price: product.price,
    img: product.img,
  };

  dispatch({ type: 'CART_ADD_LOCAL', payload: cartItem });

  const { auth } = getState();
  if (auth.user) {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;
      await fetch(`${API_BASE_URL}/api/cart/items`, {
        method: 'POST',
        headers,
        body: JSON.stringify(cartItem),
      });
    } catch (err) {
      // Local state already updated
    }
  }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
  dispatch({ type: 'CART_REMOVE_LOCAL', payload: productId });

  const { auth } = getState();
  if (auth.user) {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;
      await fetch(`${API_BASE_URL}/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers,
      });
    } catch (err) {
      // Local state already updated
    }
  }
};

export const clearCart = () => async (dispatch, getState) => {
  dispatch({ type: 'CART_CLEAR' });

  const { auth } = getState();
  if (auth.user) {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;
      await fetch(`${API_BASE_URL}/api/cart`, { method: 'DELETE', headers });
    } catch (err) {
      // Already cleared locally
    }
  }
};

export const mergeCartOnLogin = () => async (dispatch, getState) => {
  const { cart } = getState();
  if (cart.items.length === 0) {
    dispatch(fetchCart());
    return;
  }

  try {
    const headers = await getAuthHeaders();
    if (!headers) return;
    const res = await fetch(`${API_BASE_URL}/api/cart/merge`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items: cart.items }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch({ type: 'CART_SET', payload: data.items });
    }
  } catch (err) {
    // Keep local cart on failure
  }
};

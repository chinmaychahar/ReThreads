import { account } from '../../config/appwrite';
import { API_BASE_URL } from '../../config/api';
import { ID } from 'appwrite';

export const checkSession = () => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' });
  try {
    const user = await account.get();
    const profile = await fetchProfile();
    dispatch({ type: 'AUTH_SUCCESS', payload: { ...user, profile } });
  } catch (err) {
    dispatch({ type: 'AUTH_LOGOUT' });
  }
};

export const register = ({ email, password, name, role }) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' });
  try {
    await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    // Create extended profile on server
    const jwt = await account.createJWT();
    await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt.jwt}`,
      },
      body: JSON.stringify({ name, role }),
    });

    dispatch({ type: 'AUTH_SUCCESS', payload: { ...user, profile: { role } } });
    return { success: true };
  } catch (err) {
    dispatch({ type: 'AUTH_ERROR', payload: err.message });
    return { success: false, error: err.message };
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOADING' });
  try {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    const profile = await fetchProfile();
    dispatch({ type: 'AUTH_SUCCESS', payload: { ...user, profile } });
    return { success: true };
  } catch (err) {
    dispatch({ type: 'AUTH_ERROR', payload: err.message });
    return { success: false, error: err.message };
  }
};

export const logout = () => async (dispatch) => {
  try {
    await account.deleteSession('current');
  } catch (err) {
    // Session might already be expired
  }
  dispatch({ type: 'AUTH_LOGOUT' });
  dispatch({ type: 'CART_CLEAR' });
};

async function fetchProfile() {
  try {
    const jwt = await account.createJWT();
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: { 'Authorization': `Bearer ${jwt.jwt}` },
    });
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
}

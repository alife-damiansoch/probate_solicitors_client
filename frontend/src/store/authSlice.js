import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../baseUrls';

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, otp }, { rejectWithValue }) => {
    try {
      const country = Cookies.get('country_solicitors');
      const response = await axios.post(
        `${API_URL}/api/user/token/`,
        {
          email,
          password,
          otp,
        },
        {
          headers: {
            Country: country, // Adding the 'Country' header
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data);
        // Return the custom error message from API response
        return rejectWithValue(err.response.data);
      }
      // Return a generic error message if there's no response data
      return rejectWithValue({ error: 'An error occurred during signup' });
    }
  }
);

const initialState = {
  token: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      Cookies.remove('auth_token'); // Clear the token from cookies
      // Clear sessionStorage items
      sessionStorage.removeItem('frontend_api_key_solicitors');
      sessionStorage.removeItem('user_type_solicitors');
    },
    loginSuccess: (state, action) => {
      const { access, refresh, api_key, user_type } = action.payload.tokenObj;

      // Set cookies
      Cookies.set('auth_token', JSON.stringify({ access, refresh }), {
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        path: '/',
      });

      // Store API key and user type in sessionStorage as fallback
      if (api_key) {
        sessionStorage.setItem('frontend_api_key_solicitors', api_key);
        sessionStorage.setItem('user_type_solicitors', user_type || 'regular');
      }

      state.token = action.payload.tokenObj;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
    },
    setNewTokens: (state, action) => {
      const { newAccess } = action.payload;

      state.token = { access: newAccess };
      let tokenObj = Cookies.get('auth_token');
      tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
      const oldRefresh = tokenObj ? tokenObj.refresh : null;
      Cookies.set(
        'auth_token',
        JSON.stringify({ access: newAccess, refresh: oldRefresh }),
        {
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        }
      );
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        const { access, refresh, api_key, user_type } = action.payload;

        // Set cookies
        Cookies.set('auth_token', JSON.stringify({ access, refresh }), {
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          path: '/',
        });

        // Store API key and user type in sessionStorage as fallback
        if (api_key) {
          sessionStorage.setItem('frontend_api_key_solicitors', api_key);
          sessionStorage.setItem(
            'user_type_solicitors',
            user_type || 'regular'
          );
        }

        state.token = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.pending, (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.token = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loginSuccess, clearAuthError, setNewTokens } =
  authSlice.actions;
export default authSlice.reducer;

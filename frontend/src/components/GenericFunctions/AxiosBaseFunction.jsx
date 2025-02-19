import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../baseUrls';
import apiEventEmitter from '../../utils/eventEmitter';

export const refreshToken = async () => {
  let tokenObj = Cookies.get('auth_token');
  tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
  const refresh = tokenObj ? tokenObj.refresh : null;
  const country = Cookies.get('country_solicitors');

  const response = await axios.post(
    `${API_URL}/api/user/token/refresh/`,
    {
      refresh: refresh,
    },
    {
      headers: {
        Country: country, // Adding the country header
      },
      withCredentials: true,
    }
  );

  if (response.status === 200) {
    console.log('Refresh token function triggered and token recieved');
    const newTokenObj = response.data;
    Cookies.set(
      'auth_token',
      JSON.stringify({ access: newTokenObj.access, refresh: refresh }),
      {
        secure: true,
        sameSite: 'strict',
      }
    );
    return Promise.resolve(response);
  } else {
    console.error(
      'Refresh token function triggered but token not recieved: ',
      response
    );
    return Promise.reject();
  }
};

// Create new Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor
apiClient.interceptors.request.use((config) => {
  const frontendHost = window.location.origin; // Dynamically gets current frontend URL
  let tokenObj = Cookies.get('auth_token');
  tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
  const access = tokenObj ? tokenObj.access : null;
  const country = Cookies.get('country_solicitors');

  config.headers['Authorization'] = `Bearer ${access}`;
  config.headers['Country'] = country;
  config.headers['Frontend-Host'] = frontendHost;

  return config;
});

const refreshTokenEndpoint = `${API_URL}/api/user/token/refresh/`;

// Add a response interceptor
// Preserve the original response interceptor for non-blob requests
apiClient.interceptors.response.use(
  async (response) => {
    // console.log('Response Headers:', response.headers); // 🔍 Debugging
    // console.log(
    //   'X-API-Key-Expiration:',
    //   response.headers.get('x-api-key-expiration')
    // );
    // ✅ Capture API Key Expiration and Broadcast Event
    const apiKeyExpiration = response.headers['x-api-key-expiration'];
    if (apiKeyExpiration) {
      apiEventEmitter.emit('apiKeyExpirationUpdated', apiKeyExpiration);
    }
    return response;
  },
  async (error) => {
    console.log('Interceptor Error:', error);

    // Check if the error is due to network issues
    if (error.message === 'Network Error' && error.response === undefined) {
      error.message = 'Unable to connect to server. Please try again later.';
      return Promise.reject(error);
    }

    // ✅ Check for forbidden response (Invalid API Key)
    if (error.response) {
      const { status, data } = error.response;

      // ✅ Only trigger logout for specific API key errors
      if (
        status === 403 &&
        data.error &&
        [
          'Forbidden: Missing API key in request',
          'Forbidden: API key expired',
          'Forbidden: Invalid API key',
          'Forbidden: API key not found in storage',
        ].includes(data.error) // 👈 Match exact message
      ) {
        console.log('403 Forbidden - API Key Issue Detected:', data.error);

        // 🔴 Emit an event so React components can handle logout
        apiEventEmitter.emit('logoutRequired');
      }
    }

    if (
      error.response &&
      error.response.status === 401 &&
      error.config.url !== refreshTokenEndpoint
    ) {
      // Check if the response type is `blob`
      if (
        error.response.config.responseType === 'blob' &&
        error.response.data instanceof Blob
      ) {
        // Handle `blob` response separately to extract the error message
        try {
          const text = await error.response.data.text(); // Convert blob to text
          const jsonResponse = JSON.parse(text); // Parse text to JSON

          // Check if the error message indicates an expired token
          if (
            jsonResponse &&
            jsonResponse.detail === 'Given token not valid for any token type'
          ) {
            try {
              // Refresh the token and retry the request
              await refreshToken();
              let tokenObj = Cookies.get('auth_token');
              const country = Cookies.get('country_solicitors');
              tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
              const { access } = tokenObj;

              // Update the Authorization header with the new token
              error.config.headers['Authorization'] = `Bearer ${access}`;
              error.headers['Country'] = country;

              // Retry the original request with the new token
              return apiClient.request(error.config);
            } catch (err) {
              console.error('Token refresh failed during blob request:', err);
              return Promise.reject(err);
            }
          }
        } catch (blobParseError) {
          console.error('Error parsing blob response:', blobParseError);
          return Promise.reject(blobParseError);
        }
      } else {
        // Handle non-blob responses (preserve existing logic)
        try {
          await refreshToken();
          let tokenObj = Cookies.get('auth_token');
          tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
          const access = tokenObj ? tokenObj.access : null;
          const country = Cookies.get('country_solicitors');

          // Ensure token and country exist
          if (!access) {
            console.error('Token refresh failed: No access token received');
            return Promise.reject(error);
          }
          if (!country) {
            console.error('Country header is missing from cookies');
            return Promise.reject(error);
          }

          // Ensure error.config.headers exists
          if (!error.config.headers) {
            error.config.headers = {};
          }

          // Update headers
          error.config.headers['Authorization'] = `Bearer ${access}`;
          error.config.headers['Country'] = country;

          // Retry the original request with the new token
          return apiClient.request(error.config);
        } catch (err) {
          console.error('Token refresh failed:', err);
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

// // Add a response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log(error);
//     if (error.message === 'Network Error' && error.response === undefined) {
//       error.message = 'Unable to connect to server. Please try again later.';
//     } else if (
//       error.response.status === 401 &&
//       error.config.url !== refreshTokenEndpoint
//     ) {
//       try {
//         await refreshToken();
//         let tokenObj = Cookies.get('auth_token');
//         tokenObj = tokenObj ? JSON.parse(tokenObj) : null;
//         let { access } = tokenObj;
//         error.config.headers['Authorization'] = `Bearer ${access}`;

//         return apiClient.request(error.config);
//       } catch (err) {
//         // handle error during refreshing token, normally by logging out user or showing login form
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;

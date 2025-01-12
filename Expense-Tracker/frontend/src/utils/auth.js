// Save token to local storage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Remove token
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Get token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
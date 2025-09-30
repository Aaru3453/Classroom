import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      // For demo purposes - any email/password works
      if (email && password) {
        // Extract name from email (for demo purposes)
        const name = email.split('@')[0];
        const userData = { 
          email, 
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          role: 'admin' // Default role for demo
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Email and password are required' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // For demo purposes - register with provided data
      if (userData.email && userData.password && userData.name) {
        const newUser = { 
          email: userData.email, 
          name: userData.name,
          role: userData.role || 'user'
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: 'All fields are required' };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          name: profileData.name || user.name,
          email: profileData.email || user.email
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return { 
          success: true, 
          message: 'Profile updated successfully',
          user: updatedUser
        };
      } else {
        return { success: false, message: 'No user logged in' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });

    const data = await response.json();
    return data;

  } catch (error) {
    return { success: false, message: 'Failed to change password' };
  }
};

const forgotPassword = async (email) => {
  try {
    // Use your backend URL (adjust port if different)
    const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If response is not OK, use the message from backend or default
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;

  } catch (error) {
    console.error('Forgot password error:', error);
    return { 
      success: false, 
      message: error.message || 'Network error. Please check your connection and try again.' 
    };
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();
    return data;

  } catch (error) {
    return { success: false, message: 'Failed to reset password' };
  }
};

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateProfile,
      changePassword,
    forgotPassword,
    resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
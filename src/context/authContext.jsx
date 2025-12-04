import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/auth/me', { withCredentials: true });
      setUser(res.data.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          await fetchCurrentUser();
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const refreshToken = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/refresh-token', {}, { withCredentials: true });
      return true;
    } catch {
      return false;
    }
  };

  const login = async (email, password, navigate) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data.data.user);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${res.data.data.user.username}!`,
        confirmButtonText: 'OK',
      }).then(() => {
        if (navigate) navigate('/');
      });

      return { success: true };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Something went wrong!',
        confirmButtonText: 'OK',
      });

      return { success: false, message: error.response?.data?.message };
    }
  };

  const register = async (username, email, password, confirmPassword,navigate) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/auth/register',
        { username, email, password, confirmPassword },
        { withCredentials: true }
      );

      setUser(res.data.data.user);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: `Welcome, ${res.data.data.user.username}!`,
        confirmButtonText: 'OK',
      }).then(() => {
        if (navigate) navigate('/');
      });

   
      return { success: true };

     
    
    } catch (error) {
      const backend = error.response?.data;

      if (backend?.errors?.length > 0) {
        const formattedErrors = backend.errors.map(err => `• ${err.msg}`).join('<br>');
        Swal.fire({ icon: 'error', title: 'Validation Error', html: formattedErrors, confirmButtonText: 'OK' });
        return { success: false, errors: backend.errors };
      }

      Swal.fire({ icon: 'error', title: 'Registration Failed', text: backend?.message || 'Something went wrong!', confirmButtonText: 'OK' });
      return { success: false, message: backend?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

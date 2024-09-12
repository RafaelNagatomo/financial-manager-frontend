import React, { useState, createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import axios from 'axios';
import { getAuthHeaders } from '../utils/getAuthHeaders'
import api from '../utils/api';

export interface User {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  registerUser: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  editUser: (
    firstName?: string,
    lastName?: string,
    email?: string,
  ) => Promise<void>;
  changePassword: (
    currentPassword?: string,
    newPassword?: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { shortToast } = useCustomToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get<User>('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          shortToast(t('Failed to fetch user profile'), 'error');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string }>('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const userProfile = await api.get<User>('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userProfile.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || t('anUnknownErrorOccurred');
        shortToast(t(`${errorMessage}`), 'error');
      } else {
        shortToast(t('anUnknownErrorOccurred'), 'error');
      }
      throw new Error(t('failedToLogin'));
    }
  };

 const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { firstName, lastName, email, password });
      await login(email, password);
      shortToast(t('userRegisteredSuccessfully'), 'success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || t('anUnknownErrorOccurred');
        shortToast(t(`${errorMessage}`), 'error');
      } else {
        shortToast(t('anUnknownErrorOccurred'), 'error');
      }
      throw new Error(t('failedToRegister'));
    }
  };

 const editUser = async (firstName?: string, lastName?: string, email?: string) => {
    const data = {
      firstName,
      lastName,
      email
    };
    
    try {
      await api.put(`/auth/editUser/${user?.id}`, data, {
        headers: getAuthHeaders(),
      });
      shortToast(t('userEditedSuccessfully'), 'success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || t('anUnknownErrorOccurred');
        shortToast(t(`${errorMessage}`), 'error');
      } else {
        shortToast(t('anUnknownErrorOccurred'), 'error');
      }
      throw new Error(t('failedToEdit'));
    }
  };

 const changePassword = async (currentPassword?: string, newPassword?: string) => {
    const data = {
      currentPassword,
      newPassword,
    };
    
    try {
      await api.put(`/auth/changePassword/${user?.id}`, data, {
        headers: getAuthHeaders(),
      });
      shortToast(t('passwordEditedSuccessfully'), 'success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || t('anUnknownErrorOccurred');
        shortToast(t(`${errorMessage}`), 'error');
      } else {
        shortToast(t('anUnknownErrorOccurred'), 'error');
      }
      throw new Error(t('failedToEdit'));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerUser,
        editUser,
        changePassword
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
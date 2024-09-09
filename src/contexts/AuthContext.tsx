import React, { useState, createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import axios from 'axios';
import { getAuthHeaders } from '../utils/getAuthHeaders'

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
          const response = await axios.get<User>('http://localhost:3001/auth/profile', {
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
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ token: string }>('http://localhost:3001/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const userProfile = await axios.get<User>('http://localhost:3001/auth/profile', {
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
      await axios.post('http://localhost:3001/auth/register', { firstName, lastName, email, password });
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
      console.log(data)
      await axios.put(`http://localhost:3001/auth/editUser/${user?.id}`, data, {
        headers: getAuthHeaders(),
      });
      shortToast(t('usereditedSuccessfully'), 'success');
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
        editUser
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
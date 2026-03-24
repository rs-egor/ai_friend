import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api';
import type { User, Token } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Регистрация
  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data: Token = await authApi.register(email, password);
      localStorage.setItem('token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      const userData = await authApi.getMe();
      setUser(userData);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка регистрации';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // Вход
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data: Token = await authApi.login(email, password);
      localStorage.setItem('token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      const userData = await authApi.getMe();
      setUser(userData);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка входа';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // Выход
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };
};

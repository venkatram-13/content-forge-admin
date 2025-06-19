
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp > Date.now()) {
          setUser({ id: decoded.id, email: decoded.email });
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', email, password }
      });

      if (error) throw error;
      if (data.error) return { error: data.error };

      localStorage.setItem('admin_token', data.token);
      setUser(data.user);
      return {};
    } catch (error) {
      return { error: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'register', email, password }
      });

      if (error) throw error;
      if (data.error) return { error: data.error };

      return {};
    } catch (error) {
      return { error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

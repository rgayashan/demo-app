import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, UserRole } from '../types';

// Mock authentication service - replace with real implementation
const mockAuthService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    const mockUsers: Record<string, User> = {
      'broker@demo.com': {
        id: '1',
        name: 'John Broker',
        email: 'broker@demo.com',
        role: 'broker',
        permissions: [
          'view_borrowers',
          'edit_borrowers',
          'request_documents',
          'send_to_valuer',
          'view_broker_stats'
        ]
      },
      'admin@demo.com': {
        id: '2',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin',
        permissions: [
          'view_borrowers',
          'edit_borrowers',
          'request_documents',
          'send_to_valuer',
          'approve_loans',
          'escalate_to_committee',
          'view_broker_stats',
          'manage_users',
          'view_analytics'
        ]
      },
      'viewer@demo.com': {
        id: '3',
        name: 'Viewer User',
        email: 'viewer@demo.com',
        role: 'viewer',
        permissions: [
          'view_borrowers',
          'view_broker_stats'
        ]
      }
    };

    const user = mockUsers[email];
    if (!user || password !== 'demo123') {
      throw new Error('Invalid credentials');
    }

    return user;
  },

  async logout(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await mockAuthService.login(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await mockAuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

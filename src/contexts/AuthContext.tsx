import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  name: string; 
  password?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'name'>) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('teleshop_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password?: string) => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network
    
    // Pull users from local storage
    const storedUsers: User[] = JSON.parse(localStorage.getItem('teleshop_users') || '[]');
    const existingUser = storedUsers.find(u => u.username === username);

    if (existingUser && existingUser.password === password) {
      // Don't keep password in the active session context for safety if this was real
      const sessionUser = { ...existingUser };
      delete sessionUser.password;
      
      setUser(sessionUser);
      localStorage.setItem('teleshop_current_user', JSON.stringify(sessionUser));
    } else if (username === 'admin' && password === 'admin') {
       // Fallback mock admin if perfectly matching regardless of storage
       const adminUser: User = { id: 'admin-1', firstName: 'Admin', lastName: 'Boss', name: 'Admin Boss', username: 'admin', role: 'admin', avatar: '' };
       setUser(adminUser);
       localStorage.setItem('teleshop_current_user', JSON.stringify(adminUser));
    } else {
      setError('Invalid username or password.');
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: Omit<User, 'id' | 'name'>) => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const storedUsers: User[] = JSON.parse(localStorage.getItem('teleshop_users') || '[]');
    
    if (storedUsers.some(u => u.username === userData.username)) {
      setError('Username already exists.');
      throw new Error('Username already exists');
    }

    const newUser: User = {
      ...userData,
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: `${userData.firstName} ${userData.lastName}`,
      avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=2563eb&color=fff`
    };

    const newUsersList = [...storedUsers, newUser];
    localStorage.setItem('teleshop_users', JSON.stringify(newUsersList));
    
    // Auto login after register
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setUser(sessionUser);
    localStorage.setItem('teleshop_current_user', JSON.stringify(sessionUser));
    
    // Fire an event so StoreContext can update its users list in the admin dashboard immediately
    window.dispatchEvent(new Event('teleshop_users_updated'));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('teleshop_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

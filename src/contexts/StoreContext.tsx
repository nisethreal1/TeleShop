import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Phone, Order, CartItem, Address } from '../types';
import { mockPhones } from '../data/mockData';
import { User } from './AuthContext';

const defaultUsers: User[] = [
  { id: 'u1', firstName: 'John', lastName: 'Doe', name: 'John Doe', username: 'johndoe', role: 'buyer', avatar: '' },
  { id: 'u2', firstName: 'Jane', lastName: 'Seller', name: 'Jane Seller', username: 'janeseller', role: 'seller', avatar: '' },
  { id: 'u3', firstName: 'Admin', lastName: 'Boss', name: 'Admin Boss', username: 'admin', role: 'admin', avatar: '' },
];

export interface StorePhone extends Phone {
  sellerId?: string;
}

interface StoreContextType {
  phones: StorePhone[];
  addPhone: (phone: StorePhone) => void;
  deletePhone: (id: string) => void;
  updatePhone: (phone: StorePhone) => void;
  users: User[];
  deleteUser: (id: string) => void;
  orders: Order[];
  addresses: Address[];
  addAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  placeOrder: (userId: string, items: CartItem[], total: number, shippingAddress?: Address) => void;
  wishlist: { userId: string, phoneId: string }[];
  toggleWishlist: (userId: string, phoneId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [phones, setPhones] = useState<StorePhone[]>(() => {
    const stored = localStorage.getItem('teleshop_phones_v2');
    return stored ? JSON.parse(stored) : mockPhones;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('teleshop_users');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('teleshop_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem('teleshop_orders');
    return stored ? JSON.parse(stored) : [];
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const stored = localStorage.getItem('teleshop_addresses');
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState<{ userId: string, phoneId: string }[]>(() => {
    const stored = localStorage.getItem('teleshop_wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('teleshop_phones_v2', JSON.stringify(phones));
  }, [phones]);

  useEffect(() => {
    localStorage.setItem('teleshop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('teleshop_users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('teleshop_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('teleshop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Listen for user registrations that happen in AuthContext
  useEffect(() => {
    const handleUsersUpdated = () => {
      const stored = localStorage.getItem('teleshop_users');
      if (stored) setUsers(JSON.parse(stored));
    };
    window.addEventListener('teleshop_users_updated', handleUsersUpdated);
    return () => window.removeEventListener('teleshop_users_updated', handleUsersUpdated);
  }, []);

  const addPhone = (phone: StorePhone) => setPhones(prev => [phone, ...prev]);
  const updatePhone = (phone: StorePhone) => setPhones(prev => prev.map(p => p.id === phone.id ? phone : p));
  const deletePhone = (id: string) => setPhones(prev => prev.filter(p => p.id !== id));
  
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  const addAddress = (address: Address) => setAddresses(prev => [...prev, address]);
  const deleteAddress = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));

  const toggleWishlist = (userId: string, phoneId: string) => {
    setWishlist(prev => {
      const exists = prev.some(w => w.userId === userId && w.phoneId === phoneId);
      if (exists) {
        return prev.filter(w => !(w.userId === userId && w.phoneId === phoneId));
      } else {
        return [...prev, { userId, phoneId }];
      }
    });
  };

  const placeOrder = (userId: string, items: CartItem[], total: number, shippingAddress?: Address) => {
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(Math.random() * 1000000),
      userId,
      items,
      total,
      date: new Date().toISOString(),
      status: 'Processing',
      shippingAddress
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <StoreContext.Provider value={{ phones, addPhone, updatePhone, deletePhone, users, deleteUser, orders, addresses, addAddress, deleteAddress, placeOrder, wishlist, toggleWishlist }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { ChevronRight, Shield, Store, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const { login, register, error } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('buyer');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;
    
    setIsLoading(true);
    try {
      await login(loginUsername, loginPassword);
      navigate('/');
    } catch (err) {
      // Error is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regUsername || !regPassword) return;

    setIsLoading(true);
    try {
      await register({
        firstName: regFirstName,
        lastName: regLastName,
        username: regUsername,
        password: regPassword,
        role: regRole
      });
      navigate('/');
    } catch (err) {
      // Error is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'buyer', label: 'Buyer', icon: UserIcon, description: 'Shop for phones' },
    { id: 'seller', label: 'Seller', icon: Store, description: 'List and sell devices' },
  ] as const;

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-serif leading-9">
          TeleShop
        </h2>
        <p className="mt-2 text-center text-sm leading-5 text-ink/60">
          {mode === 'login' ? 'Sign in to access your account' : 'Create a new account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-ink/5 sm:rounded-3xl sm:px-10">
          
          {/* Mode Toggle */}
          <div className="flex p-1 bg-paper rounded-xl mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'login' ? 'bg-white shadow-sm text-ink' : 'text-ink/60 hover:text-ink'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'register' ? 'bg-white shadow-sm text-ink' : 'text-ink/60 hover:text-ink'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="block w-full px-4 py-3 border border-ink/20 rounded-xl focus:ring-accent focus:border-accent text-sm bg-white"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-ink/20 rounded-xl focus:ring-accent focus:border-accent text-sm bg-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 mt-6 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-ink hover:bg-ink/90 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
                {!isLoading && <LogIn size={18} />}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="block w-full px-4 py-3 border border-ink/20 rounded-xl focus:ring-accent focus:border-accent text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="block w-full px-4 py-3 border border-ink/20 rounded-xl focus:ring-accent focus:border-accent text-sm bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="block w-full px-4 py-3 border border-ink/20 rounded-xl focus:ring-accent focus:border-accent text-sm bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-ink/20 rounded-xl focus:ring-accent focus:border-accent text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-3 mt-6">Select Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegRole(r.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        regRole === r.id 
                          ? 'border-ink bg-ink/5 text-ink' 
                          : 'border-ink/5 text-ink/60 hover:border-ink/20 hover:bg-paper'
                      }`}
                    >
                      <r.icon size={20} className="mb-1" />
                      <span className="text-xs font-semibold">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 mt-8 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-ink hover:bg-ink/90 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <UserPlus size={18} />}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

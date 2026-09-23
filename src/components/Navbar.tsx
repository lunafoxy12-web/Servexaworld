import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  PhoneCall,
  Bell,
  Wallet,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Car,
  Search,
  CheckCircle2,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onOpenWalletModal: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWalletModal, onOpenSearch }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    logout,
    notifications,
    unreadNotifsCount,
    markNotificationsAsRead,
    activeCall,
    setIsAuthModalOpen,
    setAuthModalTab,
    setIsAiModalOpen,
    setIsProfileModalOpen,
    login
  } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadNotifsCount > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('customer')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    Servexa
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                  Global Service Marketplace & PBX
                </p>
              </div>
            </button>

            {/* Account Role Badge & Provider Registration */}
            <div className="hidden md:flex items-center gap-2">
              {currentUser?.role === 'provider' ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-lg text-emerald-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Service Provider Console</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-bold text-emerald-700">
                    Live Dispatch
                  </span>
                </div>
              ) : currentUser?.role === 'admin' ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Platform Super Admin</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/60 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Become a Service Provider</span>
                </button>
              )}
            </div>
          </div>

          {/* Center Search / AI Concierge Button */}
          <div className="flex-1 max-w-md hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:bg-slate-100/80 hover:border-slate-300 transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span className="font-medium text-slate-700">Search Servexa...</span>
                <span className="text-slate-400 text-[11px] truncate">"Leaking pipe" or "Ride to SFO"</span>
              </div>
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                Quick Match
              </kbd>
            </button>
          </div>

          {/* Right Controls: PBX Active Pill, Wallet, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active PBX Call banner */}
            {activeCall && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-full text-emerald-800 text-xs font-semibold animate-pulse">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">PBX Active: {activeCall.calleeName}</span>
                <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.2 rounded font-mono">
                  {activeCall.bitrateKbps}kbps
                </span>
              </div>
            )}

            {/* Assistant Quick Button for mobile */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="lg:hidden p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Servexa Concierge"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Wallet Balance Pill */}
            {currentUser && (
              <button
                onClick={onOpenWalletModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                title="View Wallet & Transactions"
              >
                <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                <span>${(currentUser.walletBalance || 0).toFixed(2)}</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">Notifications</span>
                      <span className="text-[10px] text-slate-500">{notifications.length} alerts</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-xs text-slate-400">No new notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 text-xs hover:bg-slate-50 transition-colors ${
                              !notif.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <p className="font-semibold text-slate-900">{notif.title}</p>
                            <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Menu or Standard Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                    <span className="text-[10px] font-medium text-slate-500 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentUser.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Status: {currentUser.status}
                        </span>
                        {currentUser.verified && (
                          <span className="text-[10px] font-semibold text-indigo-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Account Type Details */}
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Account Type</span>
                        <span className="font-bold text-slate-800 capitalize bg-white px-2 py-0.5 rounded border border-slate-200">
                          {currentUser.role === 'provider' ? 'Service Provider' : currentUser.role === 'admin' ? 'Super Admin' : 'Customer'}
                        </span>
                      </div>
                      {currentUser.role === 'customer' && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setAuthModalTab('register');
                            setIsAuthModalOpen(true);
                          }}
                          className="mt-2 w-full text-left px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span>List as Service Provider</span>
                          <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded">Free</span>
                        </button>
                      )}
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-600" />
                        Edit Profile & Photo
                      </button>

                      <button
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

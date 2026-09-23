import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProviderStorefront, ProviderProfile, StoreCategory, StoreProduct } from '../../types';
import { DirectImageUpload } from '../common/DirectImageUpload';
import {
  Store,
  Globe,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Copy,
  Sparkles,
  Save,
  BarChart3,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Palette,
  CreditCard,
  Share2,
  RefreshCw,
  Plus,
  Trash2,
  Package,
  Tag,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  X,
  Eye
} from 'lucide-react';

interface StorefrontManagerProps {
  providerId: string;
  providerProfile?: ProviderProfile | null;
}

export const StorefrontManager: React.FC<StorefrontManagerProps> = ({ providerId, providerProfile }) => {
  const { currentUser, openStorefrontSubdomain, triggerGlobalRefresh } = useAuth();

  const [storefront, setStorefront] = useState<ProviderStorefront | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [storeName, setStoreName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [themeColor, setThemeColor] = useState<string>('#4f46e5');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  // Categories & Products State
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [newCatName, setNewCatName] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdCategory, setNewProdCategory] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<string>('');
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdImage, setNewProdImage] = useState<string>('');
  const [newProdInStock, setNewProdInStock] = useState<boolean>(true);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);

  // Device Preview Mode (auto-fit capture: mobile, tablet, desktop)
  const [devicePreviewMode, setDevicePreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const fetchStorefront = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/providers/${providerId}/storefront`);
      const data = await res.json();
      if (res.ok && data) {
        setStorefront(data);
        setStoreName(data.storeName || '');
        setSubdomain(data.subdomain || '');
        setCustomDomain(data.customDomain || '');
        setTagline(data.tagline || '');
        setBio(data.bio || '');
        setThemeColor(data.themeColor || '#4f46e5');
        setBannerUrl(data.bannerUrl || '');
        setContactEmail(data.contactEmail || '');
        setContactPhone(data.contactPhone || '');
        setCategories(data.categories || []);
        setProducts(data.products || []);
        if (data.categories && data.categories.length > 0 && !newProdCategory) {
          setNewProdCategory(data.categories[0].name);
        }
      }
    } catch (e) {
      console.error('Error fetching storefront:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchStorefront();
    }
  }, [providerId]);

  const handleSaveStorefront = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!subdomain.trim() || !storeName.trim()) {
      setFeedback({ type: 'error', message: 'Store Name and Subdomain are required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/providers/${providerId}/storefront`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          customDomain: customDomain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, ''),
          tagline,
          bio,
          themeColor,
          bannerUrl,
          contactEmail,
          contactPhone,
          categories,
          products
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStorefront(data.storefront || data);
        setFeedback({ type: 'success', message: 'Storefront configurations saved & synced across all devices!' });
        triggerGlobalRefresh();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update storefront.' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Network error saving storefront.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/providers/${providerId}/storefront/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        setStorefront(data.storefront);
        setFeedback({
          type: 'success',
          message: 'Storefront Subdomain activated successfully! $5.00 deducted from your wallet.'
        });
        triggerGlobalRefresh();
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Subscription failed. Please check your wallet balance.'
        });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Subscription error.' });
    } finally {
      setSubscribing(false);
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAddingCategory(true);
    try {
      const res = await fetch(`/api/providers/${providerId}/storefront/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() })
      });
      const data = await res.json();
      if (res.ok && data.storefront) {
        setStorefront(data.storefront);
        setCategories(data.storefront.categories || []);
        setNewCatName('');
        setFeedback({ type: 'success', message: `Category "${data.category?.name}" added and synced!` });
        triggerGlobalRefresh();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to add category' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/providers/${providerId}/storefront/categories/${categoryId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.storefront) {
        setStorefront(data.storefront);
        setCategories(data.storefront.categories || []);
        setFeedback({ type: 'success', message: 'Category removed and synced.' });
        triggerGlobalRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    setIsAddingProduct(true);
    try {
      const res = await fetch(`/api/providers/${providerId}/storefront/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName.trim(),
          category: newProdCategory || (categories[0]?.name || 'General'),
          price: parseFloat(newProdPrice),
          description: newProdDesc.trim(),
          imageUrl: newProdImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80',
          inStock: newProdInStock
        })
      });
      const data = await res.json();
      if (res.ok && data.storefront) {
        setStorefront(data.storefront);
        setProducts(data.storefront.products || []);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdDesc('');
        setNewProdImage('');
        setFeedback({ type: 'success', message: `Product "${data.product?.name}" published to your store!` });
        triggerGlobalRefresh();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to add product' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsAddingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/providers/${providerId}/storefront/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.storefront) {
        setStorefront(data.storefront);
        setProducts(data.storefront.products || []);
        setFeedback({ type: 'success', message: 'Product removed from store.' });
        triggerGlobalRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const domainHost = window.location.host;
  const fullStoreUrl = `${window.location.origin}/?store=${subdomain || storefront?.subdomain}`;
  const customDomainUrl = customDomain ? `https://${customDomain}` : null;

  const copyStoreLink = () => {
    navigator.clipboard.writeText(fullStoreUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="w-8 h-8 mx-auto text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading your dedicated storefront...</p>
      </div>
    );
  }

  const isSubActive = storefront?.subscriptionActive;

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-start space-x-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subdomain Header & Link Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {storeName || 'Custom Store & Domain'}
                </h3>
                <p className="text-xs text-slate-500">
                  Direct storefront for your products, categories, and direct orders
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isSubActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isSubActive ? '● Active Live Domain' : '○ Subscription Pending ($5/mo)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Create your branded direct storefront using your custom store name and domain. Customers can browse your products and categories, make direct bookings, and pay with real-time tracking — orders appear automatically on your dashboard.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isSubActive ? (
              <>
                <button
                  type="button"
                  onClick={() => openStorefrontSubdomain(storefront?.subdomain || subdomain)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Preview Live Store</span>
                </button>
                <button
                  type="button"
                  onClick={copyStoreLink}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Store Link'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {subscribing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Activate Storefront ($5.00/Month)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live Addresses (Subdomain & Custom Domain) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-400 font-semibold">Servexa Subdomain:</span>
              <span className="font-mono font-bold text-slate-900 truncate">
                {subdomain ? `${subdomain}.servexa.com` : 'your-store.servexa.com'}
              </span>
            </div>
            <code className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 truncate">
              {fullStoreUrl}
            </code>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-slate-400 font-semibold">Custom Domain Name:</span>
              <span className="font-mono font-bold text-slate-900 truncate">
                {customDomain || 'No custom domain set'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-200">
              <span>{customDomain ? `CNAME -> ${subdomain || 'your-store'}.servexa.com` : 'e.g. www.mybrandservices.com'}</span>
              {customDomain && <span className="text-emerald-600 font-bold">Active</span>}
            </div>
          </div>
        </div>

        {/* Analytics Snapshot */}
        {storefront?.analytics && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Storefront Visits</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{storefront.analytics.views || 0}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Direct Orders</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">{storefront.analytics.orders || 0}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Store Revenue</p>
              <p className="text-xl font-bold text-indigo-600 mt-1">${(storefront.analytics.revenue || 0).toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: Store & Domain Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">1. Store Branding & Domain Setup</h4>
            <p className="text-xs text-slate-500">Configure your store name, subdomain, and custom domain</p>
          </div>
          <button
            type="button"
            onClick={() => handleSaveStorefront()}
            disabled={saving}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Publish</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Store Display Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Apex Master Plumbing & Heating"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subdomain */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Subdomain Handle</label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="e.g. apexplumbing"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-l-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="px-3 py-2.5 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-xs text-slate-500 font-mono select-none">
                  .servexa.com
                </span>
              </div>
            </div>

            {/* Custom Domain */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Custom Domain Name (Optional)
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="e.g. www.apexplumbing.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Tagline & Headline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 24/7 Licensed Master Technicians • Direct Fast Dispatch"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Store Bio & Description</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your certifications, service guarantees, and business story..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Banner Direct Upload */}
            <div>
              <DirectImageUpload
                value={bannerUrl}
                onChange={setBannerUrl}
                label="Storefront Banner Image"
                helperText="Direct photo or graphic for your store header"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Public Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="store@domain.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Contact Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">WhatsApp / Direct Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Theme Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Store Accent Color</label>
            <div className="flex items-center space-x-3">
              {[
                { name: 'Servexa Indigo', value: '#4f46e5' },
                { name: 'Emerald Forest', value: '#059669' },
                { name: 'Amber Warmth', value: '#d97706' },
                { name: 'Rose Red', value: '#e11d48' },
                { name: 'Royal Violet', value: '#7c3aed' },
                { name: 'Slate Modern', value: '#334155' }
              ].map((theme) => (
                <button
                  type="button"
                  key={theme.value}
                  onClick={() => setThemeColor(theme.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    themeColor === theme.value ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: theme.value }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Categories Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">2. Store Categories</h4>
              <p className="text-xs text-slate-500">Organize your store into clear customer-browsable categories</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">
            {categories.length} Categories
          </span>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md mb-5">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g., Emergency Repairs, Residential, Equipment"
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isAddingCategory || !newCatName.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isAddingCategory ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Add Category</span>
          </button>
        </form>

        {/* Categories List */}
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No categories created yet. Add one above.</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800"
              >
                <Tag className="w-3 h-3 text-indigo-500" />
                <span>{cat.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-200/60 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 3: Products & Services Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">3. Products & Services Catalog</h4>
              <p className="text-xs text-slate-500">Add products that customers can buy or book directly from your store</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
            {products.length} Products Listed
          </span>
        </div>

        {/* Add Product Form */}
        <form onSubmit={handleAddProduct} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 space-y-4">
          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add New Product / Service</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g. Tankless Water Heater Inspection"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {categories.length === 0 ? (
                  <option value="General">General</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                placeholder="95.00"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="Includes 30-point diagnostics, safety check, and certification."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Image URL (Optional)</label>
              <input
                type="url"
                value={newProdImage}
                onChange={(e) => setNewProdImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newProdInStock}
                onChange={(e) => setNewProdInStock(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-700">Available / In Stock for Immediate Order</span>
            </label>

            <button
              type="submit"
              disabled={isAddingProduct || !newProdName.trim() || !newProdPrice}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isAddingProduct ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add Product to Store</span>
            </button>
          </div>
        </form>

        {/* Products List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No products created yet. Add your first product above to launch your catalog!
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                    {p.category}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-xs">
                    ${p.price.toFixed(2)}
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      In Stock
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 4: Auto-Fitting Multi-Device Preview (Mobile, Tablet, Desktop) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">4. Multi-Device Auto-Fit Responsive Testing</h4>
            <p className="text-xs text-slate-500">
              Verify how your storefront and products automatically fit across mobile, tablet, and desktop viewports
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setDevicePreviewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                devicePreviewMode === 'mobile' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (375px)</span>
            </button>
            <button
              type="button"
              onClick={() => setDevicePreviewMode('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                devicePreviewMode === 'tablet' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              type="button"
              onClick={() => setDevicePreviewMode('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                devicePreviewMode === 'desktop' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (Full)</span>
            </button>
          </div>
        </div>

        {/* Responsive Frame Container */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-8 flex items-center justify-center overflow-x-auto min-h-[420px]">
          <div
            className={`bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700 transition-all duration-300 ${
              devicePreviewMode === 'mobile'
                ? 'w-[375px] min-h-[500px]'
                : devicePreviewMode === 'tablet'
                ? 'w-[680px] min-h-[500px]'
                : 'w-full max-w-4xl min-h-[500px]'
            }`}
          >
            {/* Mock Browser Header */}
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              </div>
              <span className="truncate max-w-[220px]">
                https://{customDomain || `${subdomain || 'yourstore'}.servexa.com`}
              </span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded uppercase font-bold text-slate-500">
                {devicePreviewMode}
              </span>
            </div>

            {/* Storefront Live Mock */}
            <div className="p-4 sm:p-6 space-y-4">
              <div
                className="h-28 rounded-xl flex items-center justify-center text-white text-center p-4 relative overflow-hidden"
                style={{ backgroundColor: themeColor }}
              >
                {bannerUrl && (
                  <img
                    src={bannerUrl}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg font-extrabold">{storeName || 'Your Store Name'}</h3>
                  <p className="text-xs opacity-90">{tagline || 'Direct booking and products portal'}</p>
                </div>
              </div>

              {/* Category tabs preview */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-bold whitespace-nowrap">
                  All
                </span>
                {categories.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold whitespace-nowrap"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Products list preview */}
              <div className={`grid gap-3 ${devicePreviewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {(products.length > 0
                  ? products.slice(0, 4)
                  : [
                      {
                        id: 'demo-1',
                        name: 'Master Diagnostic Inspection',
                        price: 75,
                        category: 'Diagnostics',
                        description: 'Complete inspection with digital report.'
                      }
                    ]
                ).map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <h6 className="text-xs font-bold text-slate-900">{p.name}</h6>
                      <span className="text-[10px] text-slate-500">{p.category}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700">
                      ${p.price.toFixed ? p.price.toFixed(2) : p.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

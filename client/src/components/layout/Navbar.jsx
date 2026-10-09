import React, { useState } from 'react';
import NavbarLogo from './../../../public/NavbarLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Globe, Menu, X, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout, getDashboardPathForRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('swasthsetu_lang', nextLang);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img  className = "h-30 w-40" src={NavbarLogo} alt="" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-sm font-medium text-dark-text hover:text-brand-500 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/about" className="text-sm font-medium text-dark-text hover:text-brand-500 transition-colors">
              {t('nav.about', 'About')}
            </Link>
            <a href="#features" className="text-sm font-medium text-dark-text hover:text-brand-500 transition-colors">
              {t('nav.features', 'Features')}
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-dark-text hover:text-brand-500 transition-colors">
              {t('nav.howItWorks', 'How It Works')}
            </a>
            <Link to="/contact" className="text-sm font-medium text-dark-text hover:text-brand-500 transition-colors">
              {t('nav.contact', 'Contact')}
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-xs font-medium text-gray-700 hover:bg-surface-bg transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{i18n.language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPathForRole(user?.role)}
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('nav.dashboard', 'Dashboard')} ({user?.name?.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-gray-500 hover:text-red-600 px-2 py-1"
                >
                  {t('nav.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
              >
                <span>{t('nav.login', 'Portal Login')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-600 hover:text-brand-500"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-surface-bg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-surface-border px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-800 py-2"
          >
            {t('nav.home', 'Home')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-800 py-2"
          >
            {t('nav.about', 'About')}
          </Link>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-800 py-2"
          >
            {t('nav.features', 'Features')}
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-800 py-2"
          >
            {t('nav.howItWorks', 'How It Works')}
          </a>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-800 py-2"
          >
            {t('nav.contact', 'Contact')}
          </Link>

          <div className="pt-3 border-t border-surface-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardPathForRole(user?.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-brand-500 text-white font-semibold py-2.5 rounded-lg text-sm"
                >
                  {t('nav.dashboard', 'Go to Dashboard')}
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-center text-sm text-red-600 py-2"
                >
                  {t('nav.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-navy-900 text-white font-semibold py-2.5 rounded-lg text-sm"
              >
                {t('nav.login', 'Portal Login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};


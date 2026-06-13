import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    clubName: 'نادي أشبال',
    logo: '',
    bgVideo: '',
    heroTitle: 'مرحباً بكم في أكاديمية أشبال',
    shortDescription: 'نحن نادي رياضي متخصص...',
    registerButtonText: 'سجل ولدك الآن',
    trackButtonText: 'تتبع ملف التسجيل',
    phone: '', email: '', address: '',
    facebook: '', instagram: '', whatsapp: '', tiktok: '',
    primaryColor: '#1a2e44', secondaryColor: '#e85d04',
    navHome: 'الرئيسية', navNews: 'الأخبار', navMatches: 'المباريات', 
    navPlayers: 'اللاعبين', navTrainings: 'التداريب', navStore: 'المتجر',
    sectionNewsTitle: 'آخر الأخبار', sectionMatchesTitle: 'المباريات القادمة',
    sectionPlayersTitle: 'نجوم الفريق', sectionTrainingsTitle: 'برنامج التداريب', sectionStoreTitle: 'متجر النادي'
  });

  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal6.replit.app/api/settings');
        if (response.data) {
          setSettings(response.data);
          
          // 🎨 السحر ديال الألوان: هنا كنبدلو ألوان السيت كاملين أوتوماتيكيا!
          document.documentElement.style.setProperty('--color-primary', response.data.primaryColor || '#1a2e44');
          document.documentElement.style.setProperty('--color-secondary', response.data.secondaryColor || '#e85d04');
        }
      } catch (error) {
        console.error('مشكل فجلب الإعدادات:', error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loadingSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

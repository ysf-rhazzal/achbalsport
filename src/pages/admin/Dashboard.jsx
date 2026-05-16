import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminRegistrations from './AdminRegistrations';
import AdminNews from './AdminNews';
import AdminPlayers from './AdminPlayers';
import AdminMatches from './AdminMatches';
import AdminTrainings from './AdminTrainings';
import AdminSettings from './AdminSettings';
import AdminStore from './AdminStore';
import AdminGallery from './AdminGallery'; // 👈 هانا جبنا صفحة المعرض الجديدة

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('registrations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'registrations': return <AdminRegistrations />;
      case 'news': return <AdminNews />;
      case 'players': return <AdminPlayers />;
      case 'matches': return <AdminMatches />;
      case 'trainings': return <AdminTrainings />;
      case 'settings': return <AdminSettings />;
      case 'store': return <AdminStore />;
      case 'gallery': return <AdminGallery />; // 👈 زدناها هنا باش تخدم ملي نكليكيو عليها
      default: return <AdminRegistrations />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-arabic" dir="rtl">
      
      {/* 📱 بوطونة الموني ديال التليفون */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 z-20 shadow-md">
        <h2 className="text-xl font-bold">إدارة أشبال</h2>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ⬛ الضل (Overlay) ملي كيكون الموني محلول فالتليفون */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 📚 القائمة الجانبية (Sidebar) */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-primary text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-white/10 mt-2 md:mt-0">
          <h2 className="text-2xl font-bold tracking-wide">إدارة أشبال</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-white/10 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <button onClick={() => handleTabChange('registrations')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'registrations' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">📋</span> طلبات التسجيل
          </button>
          <button onClick={() => handleTabChange('news')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'news' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">📰</span> إدارة الأخبار
          </button>
          <button onClick={() => handleTabChange('players')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'players' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">⚽</span> إدارة اللاعبين
          </button>
          <button onClick={() => handleTabChange('matches')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'matches' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">🏟️</span> إدارة المباريات
          </button>
          <button onClick={() => handleTabChange('trainings')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'trainings' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">⏱️</span> إدارة التداريب
          </button>
          
          {/* 👈 هادي البوطونة الجديدة ديال المعرض */}
          <button onClick={() => handleTabChange('gallery')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'gallery' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">📸</span> إدارة المعرض
          </button>

          <button onClick={() => handleTabChange('store')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'store' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">🛒</span> إدارة المتجر
          </button>
          <button onClick={() => handleTabChange('settings')} className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'settings' ? 'bg-secondary font-bold shadow-lg transform scale-105' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <span className="text-xl">⚙️</span> الإعدادات العامة
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 📄 المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-16 md:hidden flex-shrink-0"></div> 
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50/50">
            {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default Dashboard;

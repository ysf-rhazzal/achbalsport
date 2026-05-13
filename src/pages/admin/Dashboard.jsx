import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminRegistrations from './AdminRegistrations';
import AdminNews from './AdminNews';
import AdminPlayers from './AdminPlayers'; // <--- زيد هاد السطر
import AdminMatches from './AdminMatches';
import AdminTrainings from './AdminTrainings';
import AdminSettings from './AdminSettings';
import AdminStore from './AdminStore'; // تأكد من المسار واش صحيح
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('registrations');
  const navigate = useNavigate();

  // كنتأكدو واش الأدمن مكونيكطي
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

  // دالة باش نحددو المكون اللي غيبان الوسط
  const renderContent = () => {
    switch (activeTab) {
      case 'registrations':
        return <AdminRegistrations />;
      case 'news':
        return <AdminNews />;
      case 'players': // <--- زيد هاد الجوج سطورا
        return <AdminPlayers />;
      case 'matches':
        return <AdminMatches />;
      case 'trainings':
        return <AdminTrainings />;
      case 'settings':
         return <AdminSettings />;
      case 'store':
        return <AdminStore />;
      // هنا غادي نزيدو من بعد Players و Matches و Settings
      default:
        return <AdminRegistrations />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-arabic">
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-white/20">
          <h2 className="text-2xl font-bold">إدارة أشبال</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('registrations')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'registrations' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
          >
            📋 طلبات التسجيل
          </button>
          <button 
            onClick={() => setActiveTab('news')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'news' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
          >
            📰 إدارة الأخبار
          </button>
          <button 
            onClick={() => setActiveTab('players')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'players' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
            >
            ⚽ إدارة اللاعبين
            </button>
            <button 
            onClick={() => setActiveTab('matches')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'matches' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
            >
            🏟️ إدارة المباريات
            </button>
            <button 
            onClick={() => setActiveTab('trainings')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'trainings' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
            >
            ⏱️ إدارة التداريب
            </button>
            <button 
            onClick={() => setActiveTab('store')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'store' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
            >
            🛒 إدارة المتجر
            </button>
            <button 
            onClick={() => setActiveTab('settings')} 
            className={`w-full text-right px-4 py-3 rounded transition ${activeTab === 'settings' ? 'bg-secondary font-bold' : 'hover:bg-white/10'}`}
            >
            ⚙️ الإعدادات العامة
            </button>
            
          {/* هادو غنزيدوهم فالمرحلة الجاية */}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition">
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {renderContent()}
      </main>

    </div>
  );
};

export default Dashboard;
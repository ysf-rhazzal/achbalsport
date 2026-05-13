import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NewsSection from '../components/NewsSection';
import UpcomingMatch from '../components/UpcomingMatch';
import LatestPlayers from '../components/LatestPlayers'; // <--- هادي جبناها

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب الإعدادات من الباكاند
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/settings');
        // بما أننا عندنا وثيقة واحدة، الباكاند يقدر يصيفطها مباشرة أو فمصفوفة
        setSettings(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">جاري التحميل...</div>;

  return (
    <div>
      {/* قسم الفيديو والأزرار (Hero Section) */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* فيديو الخلفية - دابا ولا كيجي من الإعدادات */}
        <video 
          key={settings?.bgVideo} // key ضرورية باش الفيديو يتبدل ملي يتغير الرابط
          autoPlay 
          loop 
          muted 
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source src={settings?.bgVideo || "https://res.cloudinary.com/demo/video/upload/sample.mp4"} type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* المحتوى - كولشي ولا ديناميكي */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {settings?.clubName || "نادي أشبال للرياضة المغربية"}
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-200">
            {settings?.shortDescription || "نادي رياضي رائد في تكوين الأبطال وصناعة المستقبل"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-secondary text-xl py-3 px-8">
              {settings?.registerButtonText || "سجل ولدك الآن"}
            </Link>
            <Link to="/track" className="bg-white text-primary px-8 py-3 rounded hover:bg-gray-100 transition duration-300 font-bold text-xl shadow-lg">
              {settings?.trackButtonText || "تتبع ملف التسجيل"}
            </Link>
          </div>
        </div>
      </div>

{/* بلاصة هاديك الـ div القديمة حط هادي */}
    <NewsSection />
    <UpcomingMatch />
    <LatestPlayers /> {/* <--- وحطيناها هنا */} {/* <--- زيدها هنا */}
    </div>
  );
};

export default Home;
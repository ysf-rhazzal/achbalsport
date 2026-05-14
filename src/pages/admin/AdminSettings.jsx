import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [bgVideo, setBgVideo] = useState('');
  const [clubName, setClubName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [registerButtonText, setRegisterButtonText] = useState('');
  const [trackButtonText, setTrackButtonText] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tiktok, setTiktok] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/settings');
        if (response.data) {
          const s = response.data;
          setBgVideo(s.bgVideo || '');
          setClubName(s.clubName || '');
          setShortDescription(s.shortDescription || '');
          setRegisterButtonText(s.registerButtonText || '');
          setTrackButtonText(s.trackButtonText || '');
          setFacebook(s.facebook || '');
          setInstagram(s.instagram || '');
          setWhatsapp(s.whatsapp || '');
          setTiktok(s.tiktok || '');
        }
      } catch (error) {
        console.error('مشكل فجلب الإعدادات', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    const settingsData = { 
        bgVideo, clubName, shortDescription, registerButtonText, trackButtonText , facebook , instagram , whatsapp , tiktok,
    };

    try {
      await axios.put('https://achbalsportive--youssefrhazzal9.replit.app/api/settings', settingsData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        title: 'تم الحفظ!',
        text: 'تم تحديث إعدادات الموقع بنجاح.',
        icon: 'success',
        confirmButtonColor: '#1a2e44',
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error('مشكل فالحفظ', error);
      Swal.fire({
        title: 'فشل الحفظ!',
        text: 'وقع مشكل فالحفظ، تأكد من الاتصال بالسيرفر.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 transition-shadow";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl font-bold text-primary animate-pulse italic">جاري تحميل الإعدادات...</div>
    </div>
  );

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">⚙️ الإعدادات العامة</h2>
      
      <form onSubmit={handleSave} className="bg-gray-50 border border-gray-200 p-5 md:p-6 rounded-xl shadow-sm">
        
        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">معلومات النادي الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700">اسم النادي</label>
            <input type="text" value={clubName} onChange={(e) => setClubName(e.target.value)} className={inputClass} placeholder="مثال: نادي أشبال الرياضي" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700">وصف قصير للنادي (كيبان تحت العنوان فالرئيسية)</label>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} placeholder="اكتب وصف النادي هنا..." required></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700">رابط فيديو الخلفية (Cloudinary URL)</label>
            <input type="url" value={bgVideo} onChange={(e) => setBgVideo(e.target.value)} className={`${inputClass} text-left`} dir="ltr" placeholder="https://res.cloudinary.com/..." required />
            <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">ℹ️ حط الرابط المباشر للفيديو اللي رفعتي لـ Cloudinary.</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">نص زر التسجيل</label>
            <input type="text" value={registerButtonText} onChange={(e) => setRegisterButtonText(e.target.value)} className={inputClass} placeholder="مثال: سجل ولدك الآن" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">نص زر التتبع</label>
            <input type="text" value={trackButtonText} onChange={(e) => setTrackButtonText(e.target.value)} className={inputClass} placeholder="مثال: تتبع ملفك" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">🔗 روابط التواصل الاجتماعي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">فيسبوك (Facebook)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-blue-600 text-lg">📘</span>
                  <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} className={`${inputClass} pr-10 text-left`} dir="ltr" placeholder="https://facebook.com/..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">إنستغرام (Instagram)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-pink-600 text-lg">📸</span>
                  <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={`${inputClass} pr-10 text-left`} dir="ltr" placeholder="https://instagram.com/..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">واتساب (WhatsApp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-green-500 text-lg">💬</span>
                  <input type="url" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={`${inputClass} pr-10 text-left`} dir="ltr" placeholder="https://wa.me/..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">تيك توك (TikTok)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-black text-lg">🎵</span>
                  <input type="url" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className={`${inputClass} pr-10 text-left`} dir="ltr" placeholder="https://tiktok.com/@..." />
                </div>
            </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-5 mt-2">
          <button 
              type="submit" 
              disabled={saving} 
              className={`w-full md:w-auto font-black px-12 py-3.5 rounded-lg text-white transition-all shadow-md ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90 hover:scale-105'}`}
          >
            {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

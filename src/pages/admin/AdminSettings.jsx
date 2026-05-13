import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
      
      // تبديل الـ alert بـ SweetAlert احترافي
      Swal.fire({
        title: 'تم الحفظ!',
        text: 'تم تحديث إعدادات الموقع بنجاح. ريفريشي باش تشوف التغيير.',
        icon: 'success',
        confirmButtonColor: '#1a2e44',
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error('مشكل فالحفظ', error);
      
      // تبديل الـ alert بـ SweetAlert ديال الخطأ
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl font-bold text-primary animate-pulse italic">جاري تحميل الإعدادات...</div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl font-arabic">
      <h2 className="text-2xl font-black mb-6 border-b pb-4 text-primary italic uppercase tracking-tighter">⚙️ إعدادات الموقع العامة</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block font-bold mb-1 text-gray-700">اسم النادي</label>
            <input type="text" value={clubName} onChange={(e) => setClubName(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" required />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-1 text-gray-700">رابط فيديو الخلفية (Cloudinary URL)</label>
            <input type="text" value={bgVideo} onChange={(e) => setBgVideo(e.target.value)} className="w-full p-3 border rounded-xl text-left focus:ring-2 focus:ring-primary/20 outline-none transition-all" dir="ltr" required />
            <p className="text-[10px] text-gray-400 mt-1 italic">حط الرابط المباشر للفيديو اللي رفعتي لـ Cloudinary.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-1 text-gray-700">وصف قصير للنادي (كيبان تحت العنوان)</label>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full p-3 border rounded-xl h-28 focus:ring-2 focus:ring-primary/20 outline-none transition-all" required></textarea>
          </div>

          <div>
            <label className="block font-bold mb-1 text-gray-700">نص زر التسجيل</label>
            <input type="text" value={registerButtonText} onChange={(e) => setRegisterButtonText(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>

          <div>
            <label className="block font-bold mb-1 text-gray-700">نص زر التتبع</label>
            <input type="text" value={trackButtonText} onChange={(e) => setTrackButtonText(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          

        </div>
        
        {/* السوشيال ميديا */}
        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-inner">
            <h3 className="text-lg font-black mb-4 text-secondary italic">🔗 روابط التواصل الاجتماعي</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">فيسبوك (الرابط)</label>
                    <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="w-full p-3 border rounded-xl text-left focus:border-secondary outline-none transition-all" dir="ltr" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">إنستغرام (الرابط)</label>
                    <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full p-3 border rounded-xl text-left focus:border-secondary outline-none transition-all" dir="ltr" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">واتساب (wa.me)</label>
                    <input type="url" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full p-3 border rounded-xl text-left focus:border-secondary outline-none transition-all" dir="ltr" />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500">تيك توك (الرابط)</label>
                    <input type="url" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="w-full p-3 border rounded-xl text-left focus:border-secondary outline-none transition-all" dir="ltr" />
                </div>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={saving} 
            className={`w-full py-4 text-lg font-black rounded-2xl text-white shadow-xl transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary hover:scale-[1.02]'}`}
        >
          {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
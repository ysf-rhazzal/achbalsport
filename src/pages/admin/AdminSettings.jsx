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
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-blue-600"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                  </span>
                  <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} className={`${inputClass} pr-11 text-left`} dir="ltr" placeholder="https://facebook.com/..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">إنستغرام (Instagram)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-pink-600"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                  </span>
                  <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={`${inputClass} pr-11 text-left`} dir="ltr" placeholder="https://instagram.com/..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">واتساب (WhatsApp)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </span>
                  <input type="url" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={`${inputClass} pr-11 text-left`} dir="ltr" placeholder="https://wa.me/..." />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold mb-2 text-gray-500">تيك توك (TikTok)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-black"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.41-2.93 5.76-1.79 1.36-4.14 1.83-6.29 1.34-2.16-.5-4.04-1.92-4.99-3.95-.94-2.01-.98-4.4.11-6.42 1.09-2.02 3.12-3.37 5.34-3.72 1.15-.17 2.33-.11 3.47.16v4.01c-.55-.17-1.13-.25-1.7-.2-1.07.09-2.12.63-2.67 1.54-.56.91-.65 2.08-.24 3.05.41.97 1.31 1.69 2.34 1.9.99.18 2.03-.02 2.8-.64.76-.62 1.22-1.57 1.27-2.58.07-2.91.03-5.82.04-8.74z" /></svg>
                  </span>
                  <input type="url" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className={`${inputClass} pr-11 text-left`} dir="ltr" placeholder="https://tiktok.com/@..." />
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

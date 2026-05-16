import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // Tabs State

  // كل المتغيرات
  const [formData, setFormData] = useState({
    clubName: '', bgVideo: '', heroTitle: '', shortDescription: '',
    registerButtonText: '', trackButtonText: '', phone: '', email: '', address: '',
    facebook: '', instagram: '', whatsapp: '', tiktok: '',
    primaryColor: '#1a2e44', secondaryColor: '#e85d04',
    navHome: '', navNews: '', navMatches: '', navPlayers: '', navTrainings: '', navStore: '',
    sectionNewsTitle: '', sectionMatchesTitle: '', sectionPlayersTitle: '', sectionTrainingsTitle: '', sectionStoreTitle: ''
  });

  const [logo, setLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/settings');
        if (response.data) {
          setFormData(response.data);
          setExistingLogo(response.data.logo || '');
        }
      } catch (error) {
        console.error('مشكل فجلب الإعدادات', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    const data = new FormData();
    // نزيدو كاع المتغيرات فـ FormData
    Object.keys(formData).forEach(key => {
      if(key !== 'logo' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
         data.append(key, formData[key]);
      }
    });

    if (logo) data.append('logo', logo);

    try {
      await axios.put('https://achbalsportive--youssefrhazzal9.replit.app/api/settings', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('تم الحفظ!', 'تم تحديث الموقع بنجاح. دير ريفريش للسيت باش تشوف التغيير.', 'success');
    } catch (error) {
      console.error('مشكل فالحفظ', error);
      Swal.fire('فشل الحفظ!', 'تأكد من الاتصال بالسيرفر.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800";

  if (loading) return <div className="text-center py-20 font-bold text-primary animate-pulse">جاري تحميل الإعدادات...</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">⚙️ إعدادات الموقع الشاملة</h2>
      
      {/* 🟢 Tabs (التبويبات) */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        <button type="button" onClick={() => setActiveTab('general')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'general' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>الأساسية و الألوان</button>
        <button type="button" onClick={() => setActiveTab('texts')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'texts' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>نصوص الرئيسية</button>
        <button type="button" onClick={() => setActiveTab('nav')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'nav' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>القائمة والأقسام</button>
        <button type="button" onClick={() => setActiveTab('contact')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'contact' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>التواصل والسوشيال</button>
      </div>

      <form onSubmit={handleSave} className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
        
        {/* 1️⃣ الإعدادات الأساسية والألوان */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">اسم النادي</label>
              <input type="text" name="clubName" value={formData.clubName} onChange={handleChange} className={inputClass} required />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 flex items-center gap-4">
                لوغو النادي (Logo)
                {existingLogo && <img src={existingLogo} alt="logo" className="h-10 object-contain bg-white border p-1 rounded" />}
              </label>
              <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className={`${inputClass} !py-2`} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">اللون الأساسي (Primary)</label>
              <div className="flex gap-2 items-center">
                <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-12 h-12 p-1 border rounded cursor-pointer" />
                <input type="text" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className={inputClass} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">اللون الثانوي (Secondary)</label>
              <div className="flex gap-2 items-center">
                <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange} className="w-12 h-12 p-1 border rounded cursor-pointer" />
                <input type="text" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange} className={inputClass} dir="ltr" />
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ نصوص الصفحة الرئيسية */}
        {activeTab === 'texts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">رابط فيديو الخلفية</label>
              <input type="text" name="bgVideo" value={formData.bgVideo} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">العنوان الكبير (Hero Title)</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">الوصف القصير</label>
              <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={`${inputClass} h-24`}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">نص زر التسجيل</label>
              <input type="text" name="registerButtonText" value={formData.registerButtonText} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">نص زر التتبع</label>
              <input type="text" name="trackButtonText" value={formData.trackButtonText} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {/* 3️⃣ القائمة (Navbar) وعناوين الأقسام */}
        {activeTab === 'nav' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <h4 className="md:col-span-2 font-black text-primary border-b pb-1">كلمات القائمة العلوية (Navbar)</h4>
            <div><label className="block text-xs font-bold mb-1">الرئيسية</label><input type="text" name="navHome" value={formData.navHome} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">الأخبار</label><input type="text" name="navNews" value={formData.navNews} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">المباريات</label><input type="text" name="navMatches" value={formData.navMatches} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">اللاعبين</label><input type="text" name="navPlayers" value={formData.navPlayers} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">التداريب</label><input type="text" name="navTrainings" value={formData.navTrainings} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">المتجر</label><input type="text" name="navStore" value={formData.navStore} onChange={handleChange} className={inputClass} /></div>

            <h4 className="md:col-span-2 font-black text-primary border-b pb-1 mt-4">عناوين أقسام الموقع</h4>
            <div><label className="block text-xs font-bold mb-1">قسم الأخبار</label><input type="text" name="sectionNewsTitle" value={formData.sectionNewsTitle} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">قسم المباريات</label><input type="text" name="sectionMatchesTitle" value={formData.sectionMatchesTitle} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">قسم اللاعبين</label><input type="text" name="sectionPlayersTitle" value={formData.sectionPlayersTitle} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">قسم التداريب</label><input type="text" name="sectionTrainingsTitle" value={formData.sectionTrainingsTitle} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-bold mb-1">قسم المتجر</label><input type="text" name="sectionStoreTitle" value={formData.sectionStoreTitle} onChange={handleChange} className={inputClass} /></div>
          </div>
        )}

        {/* 4️⃣ التواصل والسوشيال ميديا */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <h4 className="md:col-span-2 font-black text-primary border-b pb-1">معلومات التواصل الأساسية</h4>
            <div><label className="block text-xs font-bold mb-1">رقم الهاتف</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" /></div>
            <div><label className="block text-xs font-bold mb-1">البريد الإلكتروني</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" /></div>
            <div className="md:col-span-2"><label className="block text-xs font-bold mb-1">العنوان</label><input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} /></div>

            <h4 className="md:col-span-2 font-black text-primary border-b pb-1 mt-4">منصات التواصل</h4>
            <div><label className="block text-xs font-bold mb-1">Facebook</label><input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" /></div>
            <div><label className="block text-xs font-bold mb-1">Instagram</label><input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" /></div>
            <div><label className="block text-xs font-bold mb-1">WhatsApp</label><input type="url" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" /></div>
            <div><label className="block text-xs font-bold mb-1">TikTok</label><input type="url" name="tiktok" value={formData.tiktok} onChange={handleChange} className={`${inputClass} text-left`} dir="ltr" /></div>
          </div>
        )}

        <div className="flex justify-end border-t border-gray-200 pt-5 mt-6">
          <button type="submit" disabled={saving} className={`w-full md:w-auto font-black px-12 py-3 rounded-lg text-white shadow-md transition-all ${saving ? 'bg-gray-400' : 'bg-primary hover:bg-opacity-90 hover:scale-105'}`}>
            {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [newsType, setNewsType] = useState('رياضي');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/news');
      setNews(response.data);
    } catch (error) {
      console.error('مشكل فجلب الأخبار', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setDate(new Date(item.date).toISOString().split('T')[0]);
    setNewsType(item.newsType);
    setExistingImage(item.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setNewsType('رياضي');
    setImage(null);
    setExistingImage('');
    if(document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('newsType', newsType);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editingId) {
        await axios.put(`https://achbalsportive--youssefrhazzal9.replit.app/api/news/${editingId}`, formData, {
          // حيدنا Content-Type باش نخليو المتصفح يتكلف ويصيفط التصويرة مزيان
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث الخبر بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://achbalsportive--youssefrhazzal9.replit.app/api/news', formData, {
          // حيدنا Content-Type حتى هنا
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'رائع!',
          text: 'تم نشر الخبر بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      }
      cancelEdit();
      fetchNews();
    } catch (error) {
      console.error('مشكل في العملية', error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل، تأكد من البيانات والسيرفر.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'واش متأكد؟',
      text: "ما غتدرش تراجع على مسح هاد الخبر!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1a2e44',
      confirmButtonText: 'نعم، امسحه!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('adminToken');
        try {
          await axios.delete(`https://achbalsportive--youssefrhazzal9.replit.app/api/news/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('تم المسح!', 'تم حذف الخبر بنجاح.', 'success');
          fetchNews();
        } catch (error) {
          console.error('مشكل في مسح الخبر', error);
          Swal.fire('خطأ!', 'وقع مشكل أثناء المسح.', 'error');
        }
      }
    });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 transition-shadow";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة الأخبار</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-5 md:p-6 rounded-xl border ${editingId ? 'bg-yellow-50 border-yellow-200 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{editingId ? '✏️ تعديل الخبر' : '➕ إضافة خبر جديد'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">عنوان الخبر</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="مثال: فوز الأشبال في المباراة..." required />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">نوع الخبر</label>
            <select value={newsType} onChange={(e) => setNewsType(e.target.value)} className={inputClass} required>
              <option value="رياضي">رياضي</option>
              <option value="إداري">إداري</option>
              <option value="إعلان">إعلان</option>
              <option value="تكوين">تكوين</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ الخبر</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 flex justify-between items-center text-gray-700">
              صورة الخبر
              {existingImage && <img src={existingImage} alt="old" className="w-10 h-10 object-cover rounded-lg border-2 border-primary/20 shadow-sm" />}
            </label>
            <input id="imageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className={`${inputClass} !py-2`} />
            {editingId && <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1"><span className="text-yellow-500">ℹ️</span> إلى ما ختاريتيش صورة جديدة، غتبقى القديمة.</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700">تفاصيل الخبر (الوصف)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} min-h-[120px] resize-y`} placeholder="اكتب تفاصيل الخبر هنا..." required></textarea>
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-black px-10 py-3 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'نشر الخبر'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">الأخبار المنشورة</h3>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-bold text-primary animate-pulse">جاري التحميل...</p>
          </div>
        ) : (
          <>
            {/* ========================================= */}
            {/* 💻 العرض الخاص بالشاشات الكبيرة (جدول) */}
            {/* ========================================= */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-right border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200 text-sm text-gray-600">
                    <th className="p-4">الصورة</th>
                    <th className="p-4 w-2/5">العنوان</th>
                    <th className="p-4">النوع</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4">
                        <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-lg shadow-sm border border-gray-200" />
                      </td>
                      <td className="p-4 font-bold text-gray-800 leading-tight">{item.title}</td>
                      <td className="p-4">
                        <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                          {item.newsType}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 font-bold">{new Date(item.date).toLocaleDateString('ar-MA')}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse min-w-[160px]">
                        <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 text-xs font-bold transition-colors shadow-sm">تعديل</button>
                        <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-xs font-bold transition-colors shadow-sm">مسح</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ========================================= */}
            {/* 📱 العرض الخاص بالهواتف (بطاقات - Cards) */}
            {/* ========================================= */}
            <div className="md:hidden flex flex-col gap-4">
              {news.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-100" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="bg-secondary/10 text-secondary w-max px-2.5 py-1 rounded-md text-[10px] font-black uppercase mb-1.5 border border-secondary/10">
                        {item.newsType}
                      </span>
                      <h4 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{item.title}</h4>
                      <span className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-1">
                        📅 {new Date(item.date).toLocaleDateString('ar-MA')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => handleEditClick(item)} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 text-xs font-bold transition-colors shadow-sm flex justify-center items-center gap-1">
                      ✏️ تعديل
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-xs font-bold transition-colors shadow-sm flex justify-center items-center gap-1">
                      🗑️ مسح
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNews;

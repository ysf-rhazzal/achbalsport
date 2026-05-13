import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
      const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/news');
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
        await axios.put(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/news/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث الخبر بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/news', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
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
          await axios.delete(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/news/${id}`, {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة الأخبار</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-6 rounded border ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingId ? '✏️ تعديل الخبر' : '➕ إضافة خبر جديد'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1">عنوان الخبر</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">نوع الخبر</label>
            <select value={newsType} onChange={(e) => setNewsType(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required>
              <option value="رياضي">رياضي</option>
              <option value="إداري">إداري</option>
              <option value="إعلان">إعلان</option>
              <option value="تكوين">تكوين</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">تاريخ الخبر</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 flex justify-between items-center">
              صورة الخبر
              {existingImage && <img src={existingImage} alt="old" className="w-8 h-8 object-cover rounded border border-gray-300" />}
            </label>
            <input id="imageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded text-sm bg-white" />
            {editingId && <p className="text-xs text-gray-500 mt-1 italic">إلى ما ختاريتيش صورة جديدة، غتبقى القديمة.</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">تفاصيل الخبر (الوصف)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-32 shadow-sm focus:ring-primary focus:border-primary" placeholder="اكتب تفاصيل الخبر هنا..." required></textarea>
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-bold px-8 py-2.5 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'نشر الخبر'}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-bold mb-4">الأخبار المنشورة</h3>
        {loading ? <p className="text-center py-4">جاري التحميل...</p> : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-right border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300 text-sm">
                  <th className="p-3">الصورة</th>
                  <th className="p-3">العنوان</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3"><img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg shadow-sm" /></td>
                    <td className="p-3 font-bold text-gray-800">{item.title}</td>
                    <td className="p-3"><span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase italic">{item.newsType}</span></td>
                    <td className="p-3 text-xs text-gray-500 font-bold">{new Date(item.date).toLocaleDateString('ar-MA')}</td>
                    <td className="p-3 text-center space-x-2 space-x-reverse min-w-[150px]">
                      <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs transition-colors">تعديل</button>
                      <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs transition-colors">مسح</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminGallery = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'مباراة', 
  });
  const [files, setFiles] = useState([]); 

  const fetchGallery = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/gallery');
      setMediaList(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      return Swal.fire('خطأ', 'المرجو اختيار صور أو فيديوهات أولاً', 'error');
    }

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    
    for (let i = 0; i < files.length; i++) {
      data.append('media', files[i]);
    }

    try {
      await axios.post('https://achbalsportive--youssefrhazzal9.replit.app/api/gallery', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire('تم بنجاح!', `تم رفع ${files.length} ملفات بنجاح.`, 'success');
      setFormData({ title: '', category: 'مباراة' });
      setFiles([]);
      document.getElementById('fileInput').value = ''; 
      fetchGallery();
    } catch (error) {
      Swal.fire('خطأ!', 'حدث مشكل أثناء الرفع.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // 👈 دالة التعديل (Update) اللي طلباتي
  const handleEdit = (item) => {
    Swal.fire({
      title: 'تعديل بيانات الملف',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: right;" dir="rtl">
          <label style="font-weight: bold; font-size: 14px;">العنوان:</label>
          <input id="edit-title" class="swal2-input" style="margin: 0;" value="${item.title}" placeholder="العنوان">
          
          <label style="font-weight: bold; font-size: 14px; mt-2">الفئة:</label>
          <select id="edit-category" class="swal2-input" style="margin: 0;">
            <option value="مباراة" ${item.category === 'مباراة' ? 'selected' : ''}>مباراة</option>
            <option value="تدريب" ${item.category === 'تدريب' ? 'selected' : ''}>تدريب</option>
            <option value="حدث" ${item.category === 'حدث' ? 'selected' : ''}>حدث / نشاط</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'حفظ التعديلات',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#1a2e44',
      preConfirm: () => {
        return {
          title: document.getElementById('edit-title').value,
          category: document.getElementById('edit-category').value
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('adminToken');
          await axios.put(`https://achbalsportive--youssefrhazzal9.replit.app/api/gallery/${item._id}`, result.value, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('تم التحديث!', 'تم حفظ التعديلات بنجاح.', 'success');
          fetchGallery(); // تحديث القائمة
        } catch (error) {
          Swal.fire('خطأ!', 'لم يتم التحديث.', 'error');
        }
      }
    });
  };

  // دالة الحذف (يلا زلقات ليه شي تصويرة)
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذا الملف نهائياً!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e85d04',
      cancelButtonColor: '#1a2e44',
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('adminToken');
          await axios.delete(`https://achbalsportive--youssefrhazzal9.replit.app/api/gallery/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('تم الحذف!', 'تم حذف الملف بنجاح.', 'success');
          setMediaList(mediaList.filter(item => item._id !== id));
        } catch (error) {
          Swal.fire('خطأ!', 'لم يتم الحذف.', 'error');
        }
      }
    });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white";

  if (loading) return <div className="text-center py-20 font-bold text-primary animate-pulse">جاري التحميل...</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg font-arabic">
      <h2 className="text-2xl font-black mb-6 text-primary border-b pb-3 flex items-center gap-2">
        <span>📸</span> إدارة المعرض (تعديل ورفع متعدد)
      </h2>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">العنوان أو الوصف للكل</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="مثال: صور مباراة أشبال ضد..." required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">الفئة</label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
              <option value="مباراة">مباراة</option>
              <option value="تدريب">تدريب</option>
              <option value="حدث">حدث / نشاط</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-2 border-2 border-dashed border-secondary/30 p-4 rounded-xl bg-white text-center hover:bg-secondary/5 transition">
            <label className="block text-sm font-black mb-2 text-primary cursor-pointer">
              👇 كليكي هنا باش تعزل بزاف ديال التصاور والفيديوهات فدقة وحدة
            </label>
            <input id="fileInput" type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="w-full cursor-pointer text-gray-500 font-bold" required />
            {files.length > 0 && (
              <p className="mt-2 text-secondary font-bold text-sm">تم اختيار {files.length} ملفات 📁</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={uploading} className={`w-full font-black py-3 rounded-lg text-white transition-all ${uploading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary hover:shadow-lg'}`}>
          {uploading ? `جاري رفع ${files.length} ملفات... (المرجو الانتظار)` : '🚀 رفع جميع الملفات للمعرض'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 group relative flex flex-col">
            <div className="h-48 bg-black relative flex items-center justify-center">
              {item.type === 'video' ? (
                <>
                  <video src={item.mediaUrl} className="w-full h-full object-cover opacity-80" />
                  <span className="absolute text-white text-3xl opacity-70">▶️</span>
                </>
              ) : (
                <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-black px-2 py-1 rounded shadow">
                {item.category}
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-800 text-sm mb-3 truncate" title={item.title}>{item.title}</h3>
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-bold">{new Date(item.createdAt).toLocaleDateString('ar-MA')}</span>
                <div className="flex gap-2">
                  {/* 👈 بوطونة التعديل */}
                  <button onClick={() => handleEdit(item)} className="bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white p-1.5 rounded transition-colors text-xs font-bold" title="تعديل">
                    ✏️
                  </button>
                  {/* 👈 بوطونة الحذف */}
                  <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-1.5 rounded transition-colors text-xs font-bold" title="حذف">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {mediaList.length === 0 && (
          <div className="col-span-full text-center text-gray-400 font-bold py-10">لا يوجد أي وسائط في المعرض حالياً.</div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({ title: '', category: 'مباراة' });
  const [files, setFiles] = useState([]); 
  
  // نافذة التعديل
  const [editModal, setEditModal] = useState(null);
  const [newFilesToAppend, setNewFilesToAppend] = useState([]); // 👈 هادي باش نشدو الملفات الجداد اللي غيتزادو فالتعديل

  const fetchGallery = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/gallery');
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return Swal.fire('خطأ', 'المرجو اختيار صور أو فيديوهات', 'error');

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
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('تم!', 'تم إنشاء الألبوم بنجاح.', 'success');
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

  const handleDeleteAlbum = async (id) => {
    Swal.fire({
      title: 'حذف الألبوم؟',
      text: "سيتم حذف الألبوم بجميع صوره وفيديوهاته!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`https://achbalsportive--youssefrhazzal9.replit.app/api/gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlbums(albums.filter(album => album._id !== id));
        Swal.fire('تم الحذف!', '', 'success');
      }
    });
  };

  // 👈 دالة التعديل تبدلات باش تصيفط الملفات الجداد
  const saveAlbumEdits = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const data = new FormData();
      
      data.append('title', editModal.title);
      data.append('category', editModal.category);
      // كنصيفطو التصاور القدام على شكل JSON string
      data.append('media', JSON.stringify(editModal.media));

      // يلا عزل شي تصاور جداد، كنزيدوهم فـ FormData
      if (newFilesToAppend && newFilesToAppend.length > 0) {
        for (let i = 0; i < newFilesToAppend.length; i++) {
          data.append('newMedia', newFilesToAppend[i]);
        }
      }

      await axios.put(`https://achbalsportive--youssefrhazzal9.replit.app/api/gallery/${editModal._id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire('تم الحفظ!', 'تم تحديث الألبوم بنجاح.', 'success');
      setEditModal(null);
      setNewFilesToAppend([]); // كنخويو الستيت
      fetchGallery();
    } catch (error) {
      Swal.fire('خطأ!', 'لم يتم الحفظ.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white";

  if (loading) return <div className="text-center py-20 font-bold text-primary">جاري التحميل...</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg font-arabic relative">
      <h2 className="text-2xl font-black mb-6 text-primary border-b pb-3">📸 إدارة المعرض (نظام الألبومات)</h2>

      {/* الفورم ديال إنشاء ألبوم جديد بقى هو هو */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-2">عنوان الألبوم</label>
            <input type="text" name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="مثال: صور مباراة أشبال..." required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">الفئة</label>
            <select name="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass}>
              <option value="مباراة">مباراة</option>
              <option value="تدريب">تدريب</option>
              <option value="حدث">حدث / نشاط</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-2 border-2 border-dashed border-secondary/30 p-4 rounded-xl bg-white text-center">
            <label className="block text-sm font-black mb-2 text-primary cursor-pointer">👇 حدد صور/فيديوهات الألبوم</label>
            <input id="fileInput" type="file" multiple accept="image/*,video/*" onChange={e => setFiles(e.target.files)} className="w-full" required />
          </div>
        </div>
        <button type="submit" disabled={uploading} className="w-full font-black py-3 rounded-lg text-white bg-primary hover:bg-secondary transition-all">
          {uploading && files.length > 0 ? 'جاري إنشاء الألبوم...' : '🚀 إنشاء الألبوم'}
        </button>
      </form>

      {/* عرض الألبومات بقى هو هو */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <div key={album._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
            <div className="h-48 bg-black relative">
              {album.coverImage?.includes('video') || album.media[0]?.type === 'video' ? (
                <video src={album.coverImage || album.media[0]?.url} className="w-full h-full object-cover opacity-80" />
              ) : (
                <img src={album.coverImage || album.media[0]?.url} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-black px-2 py-1 rounded shadow">{album.category}</div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">📁 {album.media.length} ملفات</div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-gray-800 text-sm mb-3">{album.title}</h3>
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-bold">{new Date(album.createdAt).toLocaleDateString('ar-MA')}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditModal(album)} className="bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white p-1.5 rounded transition-colors text-xs font-bold">✏️ تعديل</button>
                  <button onClick={() => handleDeleteAlbum(album._id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-1.5 rounded transition-colors text-xs font-bold">🗑️ حذف</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 نافذة التعديل (Edit Modal) - زدنا فيها اختيار ملفات جديدة */}
      {editModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-xl">تعديل الألبوم</h3>
              <button onClick={() => { setEditModal(null); setNewFilesToAppend([]); }} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input type="text" value={editModal.title} onChange={e => setEditModal({...editModal, title: e.target.value})} className={inputClass} />
                <select value={editModal.category} onChange={e => setEditModal({...editModal, category: e.target.value})} className={inputClass}>
                  <option value="مباراة">مباراة</option>
                  <option value="تدريب">تدريب</option>
                  <option value="حدث">حدث / نشاط</option>
                </select>
              </div>

              {/* 👈 هادي البلاصة فين كيزيد ملفات جديدة */}
              <div className="mb-6 border-2 border-dashed border-blue-300 p-4 rounded-xl bg-blue-50 text-center relative">
                <label className="block text-sm font-black mb-2 text-blue-600 cursor-pointer">
                  ➕ إضافة صور أو فيديوهات جديدة لهذا الألبوم
                </label>
                <input type="file" multiple accept="image/*,video/*" onChange={e => setNewFilesToAppend(e.target.files)} className="w-full text-sm text-gray-500" />
                {newFilesToAppend.length > 0 && (
                  <p className="mt-2 text-blue-600 font-bold text-sm">سيتم إضافة {newFilesToAppend.length} ملفات جديدة عند الحفظ 📁</p>
                )}
              </div>

              <h4 className="font-bold mb-3 text-gray-700">محتويات الألبوم الحالية (انقر على ❌ للحذف):</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {editModal.media.map((item, index) => (
                  <div key={index} className="relative h-24 bg-gray-200 rounded-lg overflow-hidden group">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover" />
                    )}
                    <button 
                      onClick={() => {
                        const newMedia = editModal.media.filter((_, i) => i !== index);
                        setEditModal({...editModal, media: newMedia});
                      }}
                      className="absolute top-1 right-1 bg-red-500/90 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-red-700 transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => { setEditModal(null); setNewFilesToAppend([]); }} className="px-6 py-2 bg-gray-300 rounded-lg font-bold hover:bg-gray-400">إلغاء</button>
              <button onClick={saveAlbumEdits} disabled={uploading} className={`px-6 py-2 text-white rounded-lg font-bold transition-all ${uploading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary'}`}>
                {uploading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;

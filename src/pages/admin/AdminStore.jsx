import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // المتغيرات ديال الفورم
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isPack, setIsPack] = useState(false);
  const [images, setImages] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal6.replit.app/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setTitle(product.title);
    setDescription(product.description || '');
    setPrice(product.price);
    setIsPack(product.isPack);
    setExistingImages(product.images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setIsPack(false);
    setImages(null);
    setExistingImages([]);
    if(document.getElementById('productImagesInput')) document.getElementById('productImagesInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('isPack', isPack);

    if (existingImages.length > 0) {
      existingImages.forEach(url => formData.append('existingImages', url));
    }

    if (images) {
      Array.from(images).forEach(file => formData.append('images', file));
    }

    try {
      if (editingId) {
        await axios.put(`https://achbalsportive--youssefrhazzal6.replit.app/api/products/${editingId}`, formData, {
          // حيدنا Content-Type باش نخليو Axios يصاوب Boundary لراسو
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'رائع!',
          text: 'تم تعديل المنتج بنجاح',
          icon: 'success',
          confirmButtonText: 'موافق',
          confirmButtonColor: '#1a2e44',
        });
      } else {
        await axios.post('https://achbalsportive--youssefrhazzal6.replit.app/api/products', formData, {
          // حيدنا Content-Type حتى هنا
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'رائع!',
          text: 'تمت إضافة المنتج بنجاح إلى المتجر',
          icon: 'success',
          confirmButtonText: 'موافق',
          confirmButtonColor: '#1a2e44',
        });
      }
      cancelEdit();
      fetchProducts();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل أثناء العملية، حاول مرة أخرى',
        icon: 'error',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'واش متأكد؟',
      text: "ما غتقدرش تراجع على هاد المسح!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1a2e44',
      confirmButtonText: 'نعم، امسحه!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://achbalsportive--youssefrhazzal6.replit.app/api/products/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
          });
          fetchProducts();
          Swal.fire('تم المسح!', 'تم حذف المنتج بنجاح.', 'success');
        } catch (error) {
          Swal.fire('خطأ!', 'فشل المسح، حاول مرة أخرى.', 'error');
        }
      }
    });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 transition-shadow";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة المتجر</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-5 md:p-6 rounded-xl border ${editingId ? 'bg-yellow-50 border-yellow-200 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">اسم المنتج (مثال: سيرفيت أشبال)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">الثمن (مثال: 150 درهم)</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} required />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer bg-white p-4 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={isPack} onChange={(e) => setIsPack(e.target.checked)} className="w-5 h-5 accent-secondary" />
              <span className="font-bold text-gray-800 text-sm md:text-base">هذا المنتج عبارة عن "Pack" (مجموعة منتجات بثمن واحد) 🎁</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-gray-700">وصف المنتج (القياسات المتوفرة، الثوب...)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} min-h-[100px] resize-y`}></textarea>
          </div>

          <div className="md:col-span-2 border-t border-gray-200 pt-5 mt-2">
            <label className="block text-sm font-bold mb-3 text-gray-700">صور المنتج (تقدر تختار بزاف)</label>
            
            {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                    <p className="w-full text-xs font-bold text-gray-500 mb-1">الصور الحالية (كليكي على ❌ لمسح الصورة):</p>
                    {existingImages.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                            <img src={imgUrl} alt="product" className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200" />
                            <button 
                                type="button" 
                                onClick={() => removeExistingImage(index)} 
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shadow-md hover:bg-red-700 hover:scale-110 transition-all"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <input id="productImagesInput" type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className={`${inputClass} !py-2 bg-white`} />
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-black px-10 py-3 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">المنتجات المعروضة</h3>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-bold text-primary animate-pulse">جاري التحميل...</p>
          </div>
        ) : (
          <>
            {/* 💻 العرض الخاص بالشاشات الكبيرة (جدول) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-right border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200 text-sm text-gray-600">
                    <th className="p-4">المنتج</th>
                    <th className="p-4">الثمن</th>
                    <th className="p-4">النوع</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-bold flex items-center gap-4 text-gray-800">
                        {item.images?.length > 0 ? (
                          <img src={item.images[0]} alt={item.title} className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400 shadow-sm">صورة</div>
                        )}
                        {item.title}
                      </td>
                      <td className="p-4 text-primary font-black text-lg">{item.price}</td>
                      <td className="p-4">
                        {item.isPack ? (
                          <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-black tracking-wider">🎁 Pack</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-black tracking-wider">قطعة</span>
                        )}
                      </td>
                      <td className="p-4 text-center space-x-2 space-x-reverse min-w-[160px]">
                        <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 text-xs font-bold transition-colors shadow-sm">تعديل</button>
                        <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-xs font-bold transition-colors shadow-sm">مسح</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 العرض الخاص بالهواتف (بطاقات - Cards) */}
            <div className="md:hidden flex flex-col gap-4">
              {products.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  
                  {/* شريط لوني فالجنب ديكور */}
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-primary opacity-80"></div>

                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0">
                      {item.images?.length > 0 ? (
                        <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-100" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold shadow-sm">بدون صورة</div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-gray-800 text-sm leading-snug line-clamp-2 w-3/4">{item.title}</h4>
                        {item.isPack ? (
                          <span className="bg-secondary/10 text-secondary border border-secondary/10 px-2 py-0.5 rounded text-[10px] font-black uppercase whitespace-nowrap">🎁 Pack</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-black uppercase whitespace-nowrap">قطعة</span>
                        )}
                      </div>
                      <span className="font-black text-xl text-primary mt-1">{item.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-gray-100 mt-1">
                    <button onClick={() => handleEditClick(item)} className="flex-1 bg-yellow-500 text-white py-2.5 rounded-lg hover:bg-yellow-600 text-xs font-bold transition-colors shadow-sm flex justify-center items-center gap-1">
                      ✏️ تعديل
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 text-xs font-bold transition-colors shadow-sm flex justify-center items-center gap-1">
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

export default AdminStore;

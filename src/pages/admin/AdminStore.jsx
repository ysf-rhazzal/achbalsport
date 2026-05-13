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
      const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/products');
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
        await axios.put(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        Swal.fire({
        title: 'رائع!',
        text: 'تم تعديل المنتج بنجاح',
        icon: 'success',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#1a2e44', // نفس لون النادي
        });
      } else {
        await axios.post('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        Swal.fire({
        title: 'رائع!',
        text: 'تمت إضافة المنتج بنجاح إلى المتجر',
        icon: 'success',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#1a2e44', // نفس لون النادي
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
        confirmButtonText: 'موافق'
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
        await axios.delete(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/products/${id}`, {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة المتجر (Store)</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-6 rounded border ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1">اسم المنتج (مثال: سيرفيت أشبال)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">الثمن (مثال: 150 درهم)</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer bg-white p-3 border rounded shadow-sm hover:bg-gray-50 transition">
              <input type="checkbox" checked={isPack} onChange={(e) => setIsPack(e.target.checked)} className="w-5 h-5 accent-secondary" />
              <span className="font-bold text-gray-800">هذا المنتج عبارة عن "Pack" (مجموعة منتجات بثمن واحد) 🎁</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">وصف المنتج (القياسات المتوفرة، الثوب...)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-24"></textarea>
          </div>

          <div className="md:col-span-2 border-t pt-4 mt-2">
            <label className="block text-sm font-bold mb-3">صور المنتج (تقدر تختار بزاف)</label>
            
            {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4 bg-white p-3 rounded border border-gray-200">
                    {existingImages.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                            <img src={imgUrl} alt="product" className="w-20 h-20 object-cover rounded shadow-sm border border-gray-300" />
                            <button type="button" onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md">✕</button>
                        </div>
                    ))}
                </div>
            )}
            <input id="productImagesInput" type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full p-2 border rounded bg-white" />
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-bold px-6 py-2 rounded text-white transition ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-bold mb-4">المنتجات المعروضة</h3>
        {loading ? <p>جاري التحميل...</p> : (
          <table className="w-full text-right border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="p-3">المنتج</th>
                <th className="p-3">الثمن</th>
                <th className="p-3">النوع</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold flex items-center gap-3">
                    {item.images?.length > 0 && <img src={item.images[0]} alt={item.title} className="w-12 h-12 object-cover rounded shadow-sm" />}
                    {item.title}
                  </td>
                  <td className="p-3 text-primary font-bold">{item.price}</td>
                  <td className="p-3">{item.isPack ? <span className="bg-secondary text-white px-2 py-1 rounded text-xs">🎁 Pack</span> : <span className="bg-gray-200 px-2 py-1 rounded text-xs">قطعة</span>}</td>
                  <td className="p-3 text-center space-x-2 space-x-reverse">
                    <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">تعديل</button>
                    <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">مسح</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStore;
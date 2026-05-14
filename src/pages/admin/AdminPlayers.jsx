import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('');
  const [category, setCategory] = useState('براعم'); 
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(''); 

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('https://achbalsportive--youssefrhazzal9.replit.app/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('مشكل فجلب اللاعبين', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleEditClick = (player) => {
    setEditingId(player._id);
    setName(player.name);
    setNumber(player.number);
    setPosition(player.position);
    setCategory(player.category);
    setExistingImage(player.image || player.photo || player.imageUrl || ''); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setNumber('');
    setPosition('');
    setCategory('براعم');
    setImage(null);
    setExistingImage('');
    if (document.getElementById('playerImageInput')) {
        document.getElementById('playerImageInput').value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('number', number);
    formData.append('position', position);
    formData.append('category', category);
    
    // قاديت ليك هادي باش تبقى نقية وتصيفط ديما photo كيفما تافقنا
    if (image) {
      formData.append('photo', image); 
    }

    try {
      if (editingId) {
        await axios.put(`https://achbalsportive--youssefrhazzal9.replit.app/api/players/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث بيانات اللاعب بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://achbalsportive--youssefrhazzal9.replit.app/api/players', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'رائع!',
          text: 'تمت إضافة اللاعب بنجاح إلى الفريق.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      }
      cancelEdit();
      fetchPlayers();
    } catch (error) {
      console.error('مشكل في العملية', error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل، تأكد من البيانات أو من حجم الصورة.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'واش متأكد؟',
      text: "ما غتدرش تراجع على مسح هاد اللاعب!",
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
          await axios.delete(`https://achbalsportive--youssefrhazzal9.replit.app/api/players/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('تم المسح!', 'تم حذف اللاعب من القاعدة.', 'success');
          fetchPlayers();
        } catch (error) {
          console.error('مشكل في مسح اللاعب', error);
          Swal.fire('خطأ!', 'وقع مشكل أثناء المسح.', 'error');
        }
      }
    });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 transition-shadow";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة اللاعبين</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-5 md:p-6 rounded-xl border ${editingId ? 'bg-yellow-50 border-yellow-200 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{editingId ? '✏️ تعديل بيانات اللاعب' : '➕ إضافة لاعب جديد'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">اسم اللاعب</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="الاسم الكامل" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">رقم القميص</label>
            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} className={`${inputClass} font-bold text-primary`} placeholder="مثال: 10" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">المركز</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className={inputClass} placeholder="مثال: هجوم، وسط..." required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">الفئة</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} required>
              <option value="براعم">براعم</option>
              <option value="تحت 10 سنوات">تحت 10 سنوات</option>
              <option value="تحت 11 سنوات">تحت 11 سنوات</option>
              <option value="تحت 13 سنوات">تحت 13 سنوات</option>
              <option value="تحت 15 سنوات">تحت 15 سنوات</option>
            </select>
          </div>

          <div className="lg:col-span-4 border-t border-gray-200 pt-4 mt-2">
            <label className="block text-sm font-bold mb-3 flex items-center gap-4 text-gray-700">
              صورة اللاعب
              {existingImage && <img src={existingImage} alt="old" className="w-12 h-12 object-cover rounded-full border-2 border-primary shadow-md" />}
            </label>
            <input id="playerImageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className={`${inputClass} !py-2 bg-white`} />
            {editingId && <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1"><span className="text-yellow-500">ℹ️</span> إلى ما ختاريتيش صورة جديدة، غتبقى القديمة.</p>}
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-black px-10 py-3 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة اللاعب'}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">اللاعبون المسجلون</h3>
        
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
                    <th className="p-4">اللاعب</th>
                    <th className="p-4">الرقم</th>
                    <th className="p-4">المركز</th>
                    <th className="p-4">الفئة</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-bold flex items-center gap-4">
                        <img src={item.image || item.photo || item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md" />
                        <span className="text-gray-800 text-base">{item.name}</span>
                      </td>
                      <td className="p-4 text-primary font-black text-xl">#{item.number}</td>
                      <td className="p-4 text-gray-500 font-bold">{item.position}</td>
                      <td className="p-4">
                          <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-black uppercase">
                              {item.category}
                          </span>
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

            {/* ========================================= */}
            {/* 📱 العرض الخاص بالهواتف (بطاقات - Cards) */}
            {/* ========================================= */}
            <div className="md:hidden flex flex-col gap-4">
              {players.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  
                  {/* شريط لوني فالجنب ديكور */}
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-secondary opacity-60"></div>

                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 relative">
                      <img src={item.image || item.photo || item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-full shadow-md border-2 border-white" />
                      {/* باديج ديال الفئة فوق التصويرة */}
                      <span className="absolute -bottom-2 -left-2 bg-secondary text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-gray-800 text-base leading-tight w-3/4">{item.name}</h4>
                        <span className="font-black text-2xl text-primary/80 tracking-tighter">#{item.number}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-bold mt-1 bg-gray-100 w-max px-2 py-1 rounded">
                        ⚽ {item.position}
                      </span>
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

export default AdminPlayers;

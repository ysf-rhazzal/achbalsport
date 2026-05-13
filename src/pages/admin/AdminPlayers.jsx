import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // متغير التعديل
  const [editingId, setEditingId] = useState(null);

  // المتغيرات ديال الفورم
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('');
  const [category, setCategory] = useState('U10'); // القيمة الافتراضية الجديدة
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(''); // التصويرة القديمة

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/players');
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

  // ملي نبركو على "تعديل"
  const handleEditClick = (player) => {
    setEditingId(player._id);
    setName(player.name);
    setNumber(player.number);
    setPosition(player.position);
    setCategory(player.category);
    setExistingImage(player.image || player.photo || player.imageUrl || ''); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setNumber('');
    setPosition('');
    setCategory('U10');
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
    
    if (image) {
      formData.append('image', image); 
    }

    try {
      if (editingId) {
        await axios.put(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/players/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث بيانات اللاعب بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/players', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
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
          await axios.delete(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/players/${id}`, {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة اللاعبين</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-6 rounded border ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingId ? '✏️ تعديل بيانات اللاعب' : '➕ إضافة لاعب جديد'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">اسم اللاعب</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">رقم القميص</label>
            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">المركز (مثال: هجوم، دفاع...)</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">الفئة</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded font-bold outline-none cursor-pointer" required>
              <option value="براعم">براعم</option>
                <option value="U10">تحت 10 سنوات</option>
                <option value="U11">تحت 11 سنوات</option>
                <option value="U13">تحت 13 سنوات</option>
                <option value="U15">تحت 15 سنوات</option>
            </select>
          </div>

          <div className="lg:col-span-4">
            <label className="block text-sm font-bold mb-2 flex items-center gap-4 text-gray-700">
              صورة اللاعب
              {existingImage && <img src={existingImage} alt="old" className="w-12 h-12 object-cover rounded-full border-2 border-primary shadow-sm" />}
            </label>
            <input id="playerImageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded bg-white text-sm" />
            {editingId && <p className="text-[10px] text-gray-400 mt-1 italic">إلى ما ختاريتيش صورة جديدة، غتبقى القديمة.</p>}
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-black px-8 py-2.5 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة اللاعب'}
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold p-4 bg-gray-50 border-b">اللاعبون المسجلون</h3>
        {loading ? <p className="p-4 text-center">جاري التحميل...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200 text-sm text-gray-600">
                  <th className="p-4">اللاعب</th>
                  <th className="p-4">الرقم</th>
                  <th className="p-4">المركز</th>
                  <th className="p-4">الفئة</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {players.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <img src={item.image || item.photo || item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-full border shadow-sm" />
                      <span className="text-gray-800">{item.name}</span>
                    </td>
                    <td className="p-4 text-primary font-black text-lg">#{item.number}</td>
                    <td className="p-4 text-gray-500 font-bold">{item.position}</td>
                    <td className="p-4">
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black italic uppercase">
                            {item.category}
                        </span>
                    </td>
                    <td className="p-4 text-center space-x-2 space-x-reverse min-w-[150px]">
                      <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-xs font-bold transition shadow-sm">تعديل</button>
                      <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-xs font-bold transition shadow-sm">مسح</button>
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

export default AdminPlayers;
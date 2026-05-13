import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // متغير التعديل
  const [editingId, setEditingId] = useState(null);

  // المتغيرات ديال الفورم
  const [title, setTitle] = useState('');
  const [coach, setCoach] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [ageCategory, setAgeCategory] = useState('U10'); // حدثت الفئة الافتراضية لـ U10
  const [notes, setNotes] = useState('');

  const fetchTrainings = async () => {
    try {
      const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('مشكل فجلب التداريب', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  // ملي نبركو على "تعديل"
  const handleEditClick = (training) => {
    setEditingId(training._id);
    setTitle(training.title);
    setCoach(training.coach);
    setLocation(training.location);
    setTime(training.time);
    setDate(new Date(training.date).toISOString().split('T')[0]); 
    setAgeCategory(training.ageCategory);
    setNotes(training.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCoach('');
    setLocation('');
    setTime('');
    setDate('');
    setAgeCategory('U10');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const trainingData = {
      title, coach, location, time, date, ageCategory, notes
    };

    try {
      if (editingId) {
        await axios.put(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/trainings/${editingId}`, trainingData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // تبديل alert بـ SweetAlert
        Swal.fire({
          title: 'تم التعديل!',
          text: 'تم تحديث الحصة التدريبية بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      } else {
        await axios.post('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/trainings', trainingData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // تبديل alert بـ SweetAlert
        Swal.fire({
          title: 'رائع!',
          text: 'تمت إضافة الحصة التدريبية بنجاح.',
          icon: 'success',
          confirmButtonColor: '#1a2e44'
        });
      }
      cancelEdit();
      fetchTrainings();
    } catch (error) {
      console.error('مشكل في العملية', error);
      // تبديل alert بـ SweetAlert
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل أثناء الحفظ، تأكد من البيانات.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDelete = async (id) => {
    // تبديل confirm بـ SweetAlert
    Swal.fire({
      title: 'واش متأكد؟',
      text: "ما غتدرش تراجع على مسح هاد الحصة!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1a2e44',
      confirmButtonText: 'نعم، امسحها!',
      cancelButtonText: 'إلغاء'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('adminToken');
        try {
          await axios.delete(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/trainings/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('تم المسح!', 'تم حذف الحصة بنجاح.', 'success');
          fetchTrainings();
        } catch (error) {
          console.error('مشكل في مسح الحصة', error);
          Swal.fire('خطأ!', 'وقع مشكل أثناء المسح.', 'error');
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">إدارة التداريب</h2>

      <form onSubmit={handleSubmit} className={`mb-10 p-6 rounded border ${editingId ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingId ? '✏️ تعديل الحصة التدريبية' : '➕ إضافة حصة جديدة'}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">إلغاء التعديل</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1">عنوان الحصة (مثال: حصة لياقة)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">اسم المدرب</label>
            <input type="text" value={coach} onChange={(e) => setCoach(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">المكان / الملعب</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">التاريخ</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">التوقيت (مثال: 16:00 - 18:00)</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary text-center" required dir="ltr" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">الفئة العمرية</label>
            <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)} className="w-full p-2 border rounded font-bold shadow-sm focus:ring-primary focus:border-primary" required>
              <option value="براعم">براعم</option>
                <option value="U10">تحت 10 سنوات</option>
                <option value="U11">تحت 11 سنوات</option>
                <option value="U13">تحت 13 سنوات</option>
                <option value="U15">تحت 15 سنوات</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-bold mb-1">ملاحظات (اختياري)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثال: إحضار القميص الأزرق..." className="w-full p-2 border rounded shadow-sm focus:ring-primary focus:border-primary" />
          </div>
        </div>
        
        <button type="submit" className={`w-full md:w-auto font-black px-8 py-2.5 rounded-lg text-white transition-all shadow-md ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary hover:bg-opacity-90'}`}>
            {editingId ? 'حفظ التعديلات' : 'إضافة الحصة'}
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <h3 className="text-lg font-bold p-4 bg-gray-50 border-b">جدول التداريب</h3>
        {loading ? <p className="p-4 text-center">جاري التحميل...</p> : (
          <table className="w-full text-right border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300 text-sm">
                <th className="p-3">الفئة</th>
                <th className="p-3">العنوان والمدرب</th>
                <th className="p-3">التاريخ والتوقيت</th>
                <th className="p-3">المكان</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3"><span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black italic uppercase tracking-tighter">{item.ageCategory}</span></td>
                  <td className="p-3">
                        <p className="font-bold text-gray-800">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold">كوتش: {item.coach}</p>
                  </td>
                  <td className="p-3">
                        <p className="font-bold text-sm">{new Date(item.date).toLocaleDateString('ar-MA')}</p>
                        <p className="text-xs text-secondary font-black" dir="ltr">{item.time}</p>
                  </td>
                  <td className="p-3 text-gray-500 font-bold text-xs">{item.location}</td>
                  <td className="p-3 text-center space-x-2 space-x-reverse min-w-[150px]">
                    <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-xs font-bold transition shadow-sm">تعديل</button>
                    <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-xs font-bold transition shadow-sm">مسح</button>
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

export default AdminTrainings;
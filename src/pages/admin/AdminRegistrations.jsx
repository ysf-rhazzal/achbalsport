import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get('https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/registrations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(response.data);
      } catch (error) {
        console.error('مشكل فجلب البيانات', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://8be10083-1e37-47e1-9fce-56446b72d950-00-3uxap2afpc8tk.janeway.replit.dev/api/registrations/${id}/status`, 
        { status: newStatus, adminNote: 'تمت المراجعة من طرف الإدارة' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRegistrations(registrations.map(reg => 
        reg._id === id ? { ...reg, status: newStatus } : reg
      ));
      
      if(selectedReg && selectedReg._id === id) {
          setSelectedReg({...selectedReg, status: newStatus});
      }

      // تبديل التنبيه لـ SweetAlert
      Swal.fire({
        title: 'تم التحديث!',
        text: 'تم تغيير حالة الملف بنجاح.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: '#1a2e44'
      });

    } catch (error) {
      console.error('مشكل فتغيير الحالة', error);
      // تبديل التنبيه لـ SweetAlert
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل، ما تبدلاتش الحالة.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  const getDownloadUrl = (url) => {
    if(!url) return '#';
    return url.replace('/upload/', '/upload/fl_attachment/');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl font-bold text-primary animate-pulse italic">جاري تحميل التسجيلات...</div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto font-arabic">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-primary">طلبات التسجيل</h2>
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300 text-sm">
            <th className="p-3">رقم الملف</th>
            <th className="p-3">اسم الطفل</th>
            <th className="p-3">ولي الأمر</th>
            <th className="p-3">الحالة</th>
            <th className="p-3 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg._id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3 font-bold text-primary">{reg.fileNumber}</td>
              <td className="p-3 font-medium text-gray-800">{reg.childInfo?.fullName}</td>
              <td className="p-3 text-gray-600">{reg.parentInfo?.fullName}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black italic uppercase ${
                    reg.status === 'مقبول' ? 'bg-green-100 text-green-700' : 
                    reg.status === 'مرفوض' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {reg.status}
                </span>
              </td>
              <td className="p-3 flex justify-center gap-2">
                <button onClick={() => setSelectedReg(reg)} className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-opacity-90 text-xs font-bold transition shadow-sm">
                  عرض التفاصيل
                </button>
                <select value={reg.status} onChange={(e) => handleStatusChange(reg._id, e.target.value)} className="p-1 border rounded-lg bg-white text-xs font-bold outline-none cursor-pointer">
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="ناقص وثائق">ناقص وثائق</option>
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* النافذة المنبثقة (Modal) لعرض تفاصيل الملف */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4 mb-5">
              <h2 className="text-2xl font-black text-primary italic uppercase tracking-tighter">تفاصيل الملف: {selectedReg.fileNumber}</h2>
              <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-red-500 transition-colors font-bold text-2xl">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-primary border-b border-gray-200 pb-2 mb-4 italic">🏃 معلومات الطفل</h3>
                <div className="space-y-3 font-bold text-gray-700">
                    <p><span className="text-gray-400">الاسم الكامل:</span> {selectedReg.childInfo?.fullName}</p>
                    <p><span className="text-gray-400">تاريخ الازدياد:</span> {new Date(selectedReg.childInfo?.birthDate).toLocaleDateString()}</p>
                    <p><span className="text-gray-400">الفئة:</span> {selectedReg.childInfo?.ageCategory}</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-primary border-b border-gray-200 pb-2 mb-4 italic">👨‍👩‍👧 معلومات ولي الأمر</h3>
                <div className="space-y-3 font-bold text-gray-700">
                    <p><span className="text-gray-400">الاسم الكامل:</span> {selectedReg.parentInfo?.fullName}</p>
                    <p><span className="text-gray-400">الهاتف:</span> <span dir="ltr" className="text-secondary tracking-widest">{selectedReg.parentInfo?.phone}</span></p>
                    <p><span className="text-gray-400">الرقم الوطني:</span> {selectedReg.parentInfo?.cin}</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 md:col-span-2">
                <h3 className="text-lg font-black text-primary border-b border-gray-200 pb-2 mb-4 italic">📄 الوثائق المرفوعة</h3>
                <div className="flex flex-wrap gap-4 font-bold">
                  {selectedReg.documents?.childPhoto && <a href={getDownloadUrl(selectedReg.documents.childPhoto)} className="bg-white border px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm">📸 صورة الطفل</a>}
                  {selectedReg.documents?.schoolCertificate && <a href={getDownloadUrl(selectedReg.documents.schoolCertificate)} className="bg-white border px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm">📜 الشهادة المدرسية</a>}
                  {selectedReg.documents?.parentCinCopy && <a href={getDownloadUrl(selectedReg.documents.parentCinCopy)} className="bg-white border px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm">🪪 نسخة البطاقة</a>}
                  {selectedReg.documents?.medicalCertificate && <a href={getDownloadUrl(selectedReg.documents.medicalCertificate)} className="bg-white border px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition shadow-sm">🩺 الشهادة الطبية</a>}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t pt-5">
              <button onClick={() => setSelectedReg(null)} className="bg-gray-100 text-gray-600 font-black px-10 py-3 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs">إغلاق النافذة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [step, setStep] = useState(1);
  const [fileNumber, setFileNumber] = useState(null); // باش نبينو رقم الملف فاللخر
  const [loading, setLoading] = useState(false);

  // تخزين المعلومات النصية
  const [formData, setFormData] = useState({
    childFullName: '', childBirthDate: '', childAge: '', childEducation: '', childCity: '', childCategory: '', childPosition: '', childPlayedBefore: 'لا',
    parentFullName: '', parentPhone: '', parentWhatsapp: '', parentEmail: '', parentCin: '', parentAddress: '',
    hasDisease: 'لا', hasAllergies: 'لا', canPlaySport: 'نعم'
  });

  // تخزين الوثائق (الملفات)
  const [files, setFiles] = useState({
    childPhoto: null, schoolCertificate: null, parentCinCopy: null, medicalCertificate: null, parentAuthorization: null
  });

  // دالة تغيير النصوص
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // دالة تغيير الملفات
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // إرسال البيانات للسيرفر
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // حيت عندنا تصاور، خاصنا نخدمو بـ FormData
    const data = new FormData();
    
    // جمعناهم كيفما كيتسناهم الـ Backend
    data.append('childInfo', JSON.stringify({
      fullName: formData.childFullName, birthDate: formData.childBirthDate, age: formData.childAge, educationLevel: formData.childEducation, city: formData.childCity, ageCategory: formData.childCategory, preferredPosition: formData.childPosition, playedBefore: formData.childPlayedBefore === 'نعم'
    }));
    
    data.append('parentInfo', JSON.stringify({
      fullName: formData.parentFullName, phone: formData.parentPhone, whatsapp: formData.parentWhatsapp, email: formData.parentEmail, cin: formData.parentCin, address: formData.parentAddress
    }));

    data.append('healthInfo', JSON.stringify({
      hasDisease: formData.hasDisease, hasAllergies: formData.hasAllergies, canPlaySport: formData.canPlaySport === 'نعم'
    }));

    // إضافة الوثائق
    for (const key in files) {
      if (files[key]) data.append(key, files[key]);
    }

    try {
      const response = await axios.post('https://achbalsportive--youssefrhazzal9.replit.app/api/registrations/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFileNumber(response.data.fileNumber); // كنخبيو رقم الملف اللي رجع من السيرفر
    } catch (error) {
      console.error('مشكل فالتسجيل', error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل أثناء العملية، حاول مرة أخرى',
        icon: 'error',
        confirmButtonText: 'موافق'
        });
        } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">سجل ولدك فـ نادي أشبال</h2>

        {/* يلا سالا التسجيل بنجاح */}
        {fileNumber ? (
          <div className="text-center p-10 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">تم إرسال طلبك بنجاح!</h3>
            <p className="text-lg">رقم تتبع الملف ديالك هو:</p>
            <p className="text-3xl font-bold text-primary my-4">{fileNumber}</p>
            <p className="text-gray-600">احتفظ بهاد الرقم باش تقدر تتبع حالة الملف ديالك من صفحة "تتبع التسجيل".</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* الخطوة 1: معلومات الطفل */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b pb-2 mb-4">1. معلومات الطفل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="childFullName" placeholder="الاسم الكامل للطفل" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="date" name="childBirthDate" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="number" name="childAge" placeholder="العمر" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="text" name="childEducation" placeholder="المستوى الدراسي" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="text" name="childCity" placeholder="المدينة" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <select name="childCategory" onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">اختار الفئة العمرية</option>
                    <option value="براعم">براعم</option>
                    <option value="صغار">صغار</option>
                    <option value="فتيان">فتيان</option>
                  </select>
                  <input type="text" name="childPosition" placeholder="المركز المفضل (مثلا: هجوم)" onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary mt-6 w-full">التالي: معلومات ولي الأمر</button>
              </div>
            )}

            {/* الخطوة 2: معلومات ولي الأمر والصحة */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b pb-2 mb-4">2. معلومات ولي الأمر والمعلومات الصحية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="parentFullName" placeholder="الاسم الكامل لولي الأمر" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="text" name="parentCin" placeholder="رقم البطاقة الوطنية" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="tel" name="parentPhone" placeholder="رقم الهاتف" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="tel" name="parentWhatsapp" placeholder="رقم الواتساب" onChange={handleChange} className="w-full p-2 border rounded" required />
                  <input type="email" name="parentEmail" placeholder="البريد الإلكتروني" onChange={handleChange} className="w-full p-2 border rounded md:col-span-2" required />
                  <textarea name="parentAddress" placeholder="العنوان السكني" onChange={handleChange} className="w-full p-2 border rounded md:col-span-2" required></textarea>
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(1)} className="bg-gray-400 text-white px-6 py-2 rounded">السابق</button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary">التالي: رفع الوثائق</button>
                </div>
              </div>
            )}

            {/* الخطوة 3: الوثائق */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b pb-2 mb-4">3. رفع الوثائق</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">صورة الطفل</label>
                    <input type="file" name="childPhoto" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">شهادة مدرسية</label>
                    <input type="file" name="schoolCertificate" onChange={handleFileChange} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">نسخة بطاقة ولي الأمر</label>
                    <input type="file" name="parentCinCopy" onChange={handleFileChange} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">شهادة طبية</label>
                    <input type="file" name="medicalCertificate" onChange={handleFileChange} className="w-full p-2 border rounded" />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(2)} className="bg-gray-400 text-white px-6 py-2 rounded">السابق</button>
                  <button type="submit" disabled={loading} className="btn-secondary">
                    {loading ? 'جاري الإرسال...' : 'تأكيد التسجيل وإرسال الملف'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
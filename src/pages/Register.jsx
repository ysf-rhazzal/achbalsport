import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [step, setStep] = useState(1);
  const [fileNumber, setFileNumber] = useState(null); 
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

    const data = new FormData();
    
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
      setFileNumber(response.data.fileNumber); 
    } catch (error) {
      console.error('مشكل فالتسجيل', error);
      Swal.fire({
        title: 'خطأ!',
        text: 'وقع مشكل أثناء العملية، حاول مرة أخرى',
        icon: 'error',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#1a2e44'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-arabic" dir="rtl">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">سجل ولدك فـ نادي أشبال</h2>

        {fileNumber ? (
          <div className="text-center p-10 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">تم إرسال طلبك بنجاح!</h3>
            <p className="text-lg">رقم تتبع الملف ديالك هو:</p>
            <p className="text-4xl font-black text-primary my-4 tracking-widest">{fileNumber}</p>
            <p className="text-gray-600 font-bold">احتفظ بهاد الرقم باش تقدر تتبع حالة الملف ديالك من صفحة "تتبع التسجيل".</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* الخطوة 1: معلومات الطفل */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-primary">1. معلومات الطفل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="childFullName" value={formData.childFullName} placeholder="الاسم الكامل للطفل" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  
                  {/* هنا حلينا المشكل ديال الآيفون بـ JavaScript نيشان */}
                  <input 
                    type="text" 
                    name="childBirthDate" 
                    placeholder="تاريخ الازدياد" 
                    onFocus={(e) => {
                      e.target.type = 'date';
                      if (e.target.showPicker) e.target.showPicker(); 
                    }} 
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    value={formData.childBirthDate}
                    onChange={handleChange} 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 bg-white" 
                    required 
                  />

                  <input type="number" name="childAge" value={formData.childAge} placeholder="العمر" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  <input type="text" name="childEducation" value={formData.childEducation} placeholder="المستوى الدراسي" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  <input type="text" name="childCity" value={formData.childCity} placeholder="المدينة" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  
                  <select name="childCategory" value={formData.childCategory} onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required>
                    <option value="">اختار الفئة العمرية</option>
                    <option value="U10">U10</option>
                    <option value="U11">U11</option>
                    <option value="U13">U13</option>
                    <option value="U15">U15</option>
                    <option value="U17">U17</option>
                    <option value="U19">U19</option>
                    <option value="Senior">Senior</option>
                  </select>

                  <input type="text" name="childPosition" value={formData.childPosition} placeholder="المركز المفضل (مثلا: هجوم)" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>
                <button type="button" onClick={() => setStep(2)} className="bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg mt-6 w-full transition-colors shadow-md">التالي: معلومات ولي الأمر</button>
              </div>
            )}

            {/* الخطوة 2: معلومات ولي الأمر والصحة */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-primary">2. معلومات ولي الأمر والمعلومات الصحية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="parentFullName" value={formData.parentFullName} placeholder="الاسم الكامل لولي الأمر" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  <input type="text" name="parentCin" value={formData.parentCin} placeholder="رقم البطاقة الوطنية" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                  <input type="tel" name="parentPhone" value={formData.parentPhone} placeholder="رقم الهاتف" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-right" dir="ltr" required />
                  <input type="tel" name="parentWhatsapp" value={formData.parentWhatsapp} placeholder="رقم الواتساب" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-right" dir="ltr" required />
                  <input type="email" name="parentEmail" value={formData.parentEmail} placeholder="البريد الإلكتروني" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 md:col-span-2 text-right" dir="ltr" required />
                  <textarea name="parentAddress" value={formData.parentAddress} placeholder="العنوان السكني" onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 md:col-span-2" required></textarea>
                </div>
                <div className="flex justify-between mt-8">
                  <button type="button" onClick={() => setStep(1)} className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">السابق</button>
                  <button type="button" onClick={() => setStep(3)} className="bg-primary hover:bg-secondary text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-md">التالي: رفع الوثائق</button>
                </div>
              </div>
            )}

            {/* الخطوة 3: الوثائق */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-primary">3. رفع الوثائق</h3>
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">صورة الطفل <span className="text-red-500">*</span></label>
                    <input type="file" name="childPhoto" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-lg bg-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">شهادة مدرسية</label>
                    <input type="file" name="schoolCertificate" onChange={handleFileChange} className="w-full p-2 border rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">نسخة بطاقة ولي الأمر</label>
                    <input type="file" name="parentCinCopy" onChange={handleFileChange} className="w-full p-2 border rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">شهادة طبية</label>
                    <input type="file" name="medicalCertificate" onChange={handleFileChange} className="w-full p-2 border rounded-lg bg-white" />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button type="button" onClick={() => setStep(2)} className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">السابق</button>
                  <button type="submit" disabled={loading} className={`text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-opacity-90'}`}>
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

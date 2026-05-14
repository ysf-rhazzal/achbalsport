import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [step, setStep] = useState(1);
  const [fileNumber, setFileNumber] = useState(null); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    childFullName: '', childBirthDate: '', childAge: '', childEducation: '', childCity: '', childCategory: '', childPosition: '', childPlayedBefore: 'لا',
    parentFullName: '', parentPhone: '', parentWhatsapp: '', parentEmail: '', parentCin: '', parentAddress: '',
    hasDisease: 'لا', hasAllergies: 'لا', canPlaySport: 'نعم'
  });

  const [files, setFiles] = useState({
    childPhoto: null, schoolCertificate: null, parentCinCopy: null, medicalCertificate: null, parentAuthorization: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

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

  // كلاس موحد لجميع الخانات باش يجيو مقادين 100% فالحجم والبوردر
  const inputClass = "w-full h-[52px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 appearance-none";

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
                  <input type="text" name="childFullName" value={formData.childFullName} placeholder="الاسم الكامل للطفل" onChange={handleChange} className={inputClass} required />
                  
                  {/* ====== الحل النهائي الموحد للآيفون ====== */}
                  <div className="relative w-full h-[52px]">
                    {!formData.childBirthDate && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        تاريخ الازدياد
                      </span>
                    )}
                    <input 
                      type="date" 
                      name="childBirthDate" 
                      value={formData.childBirthDate}
                      onChange={handleChange} 
                      /* هنا فرضنا البوردر والطول باش ما يصغارش، و text-transparent باش يغبر التاريخ يلا كان خاوي */
                      className={`w-full h-[52px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white block appearance-none ${!formData.childBirthDate ? 'text-transparent' : 'text-gray-800'}`} 
                      required 
                    />
                  </div>
                  {/* ================================== */}

                  <input type="number" name="childAge" value={formData.childAge} placeholder="العمر" onChange={handleChange} className={inputClass} required />
                  <input type="text" name="childEducation" value={formData.childEducation} placeholder="المستوى الدراسي" onChange={handleChange} className={inputClass} required />
                  <input type="text" name="childCity" value={formData.childCity} placeholder="المدينة" onChange={handleChange} className={inputClass} required />
                  
                  <select name="childCategory" value={formData.childCategory} onChange={handleChange} className={inputClass} required>
                    <option value="">اختار الفئة العمرية</option>
                    <option value="U10">U10</option>
                    <option value="U11">U11</option>
                    <option value="U13">U13</option>
                    <option value="U15">U15</option>
                    <option value="U17">U17</option>
                    <option value="U19">U19</option>
                    <option value="Senior">Senior</option>
                  </select>

                  <input type="text" name="childPosition" value={formData.childPosition} placeholder="المركز المفضل (مثلا: هجوم)" onChange={handleChange} className={inputClass} required />
                </div>
                <button type="button" onClick={() => setStep(2)} className="bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg mt-6 w-full transition-colors shadow-md">التالي: معلومات ولي الأمر</button>
              </div>
            )}

            {/* الخطوة 2: معلومات ولي الأمر والصحة */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xl font-bold border-b pb-2 mb-4 text-primary">2. معلومات ولي الأمر والمعلومات الصحية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="parentFullName" value={formData.parentFullName} placeholder="الاسم الكامل لولي الأمر" onChange={handleChange} className={inputClass} required />
                  <input type="text" name="parentCin" value={formData.parentCin} placeholder="رقم البطاقة الوطنية" onChange={handleChange} className={inputClass} required />
                  <input type="tel" name="parentPhone" value={formData.parentPhone} placeholder="رقم الهاتف" onChange={handleChange} className={`${inputClass} text-right`} dir="ltr" required />
                  <input type="tel" name="parentWhatsapp" value={formData.parentWhatsapp} placeholder="رقم الواتساب" onChange={handleChange} className={`${inputClass} text-right`} dir="ltr" required />
                  <input type="email" name="parentEmail" value={formData.parentEmail} placeholder="البريد الإلكتروني" onChange={handleChange} className={`${inputClass} md:col-span-2 text-right`} dir="ltr" required />
                  <textarea name="parentAddress" value={formData.parentAddress} placeholder="العنوان السكني" onChange={handleChange} className="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-800 md:col-span-2" required></textarea>
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
                    <input type="file" name="childPhoto" accept="image/*" onChange={handleFileChange} className="w-full h-[52px] p-2 border border-gray-300 rounded-lg bg-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">شهادة مدرسية</label>
                    <input type="file" name="schoolCertificate" onChange={handleFileChange} className="w-full h-[52px] p-2 border border-gray-300 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">نسخة بطاقة ولي الأمر</label>
                    <input type="file" name="parentCinCopy" onChange={handleFileChange} className="w-full h-[52px] p-2 border border-gray-300 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">شهادة طبية</label>
                    <input type="file" name="medicalCertificate" onChange={handleFileChange} className="w-full h-[52px] p-2 border border-gray-300 rounded-lg bg-white" />
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

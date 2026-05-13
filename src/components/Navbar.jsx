import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // دالة باش نسدو القائمة ملي نبركو على شي رابط فالتليفون
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50 font-arabic" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* اللوغو */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-black tracking-wider" onClick={closeMenu}>
              أشبال<span className="text-secondary">.</span>
            </Link>
          </div>

          {/* الروابط فـ البيسي (استعملنا gap-8 باش ما يتلاصقوش) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold">
            <Link to="/" className="hover:text-secondary transition duration-300">الرئيسية</Link>
            <Link to="/news" className="hover:text-secondary transition duration-300">الأخبار</Link>
            <Link to="/matches" className="hover:text-secondary transition duration-300">المباريات</Link>
            <Link to="/players" className="hover:text-secondary transition duration-300">اللاعبين</Link>
            <Link to="/trainings" className="hover:text-secondary transition duration-300">التداريب</Link>
            <Link to="/store" className="hover:text-secondary transition duration-300">المتجر</Link>
          </div>

          {/* زر التسجيل السريع فـ البيسي */}
          <div className="hidden md:block">
            <Link to="/register" className="bg-secondary hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg transition shadow-md">
              سجل ولدك
            </Link>
          </div>

          {/* زر القائمة فـ التليفون (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="focus:outline-none p-2 rounded-md hover:bg-white/10 transition"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* القائمة فـ التليفون */}
      <div 
        className={`md:hidden absolute w-full bg-[#1a2e44] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] border-t border-white/10" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 space-y-4 font-bold text-lg">
          <Link to="/" onClick={closeMenu} className="block hover:text-secondary transition">الرئيسية</Link>
          <Link to="/news" onClick={closeMenu} className="block hover:text-secondary transition">الأخبار</Link>
          <Link to="/matches" onClick={closeMenu} className="block hover:text-secondary transition">المباريات</Link>
          <Link to="/players" onClick={closeMenu} className="block hover:text-secondary transition">اللاعبين</Link>
          <Link to="/trainings" onClick={closeMenu} className="block hover:text-secondary transition">التداريب</Link>
          <Link to="/store" onClick={closeMenu} className="block hover:text-secondary transition">المتجر</Link>
          
          <div className="pt-4 border-t border-white/10">
            <Link to="/register" onClick={closeMenu} className="block text-center bg-secondary text-white py-3 rounded-lg shadow-md transition hover:bg-opacity-90">
              سجل ولدك الآن
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
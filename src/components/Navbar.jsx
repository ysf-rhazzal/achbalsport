import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useContext(SettingsContext);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50 font-arabic" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* اللوغو وسمية النادي */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
              {/* التصويرة ديال اللوغو */}
              {settings?.logo ? (
                <img src={settings.logo} alt="Logo" className="h-12 w-12 object-contain bg-white rounded-full p-1 shadow-sm" />
              ) : (
                <span className="text-3xl font-black tracking-wider">
                  أشبال<span className="text-secondary">.</span>
                </span>
              )}
              {/* 👈 هاني قاديتها باش تبقى ديما باينة حدا اللوغو فين درتي السهم */}
              <span className="text-xl md:text-2xl font-bold tracking-wider text-white whitespace-nowrap">
                {settings?.clubName || 'نادي أشبال'}
              </span>
            </Link>
          </div>

          {/* الروابط فـ البيسي */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold">
            <Link to="/" className="hover:text-secondary transition duration-300">{settings?.navHome || 'الرئيسية'}</Link>
            <Link to="/news" className="hover:text-secondary transition duration-300">{settings?.navNews || 'الأخبار'}</Link>
            <Link to="/matches" className="hover:text-secondary transition duration-300">{settings?.navMatches || 'المباريات'}</Link>
            <Link to="/players" className="hover:text-secondary transition duration-300">{settings?.navPlayers || 'اللاعبين'}</Link>
            <Link to="/trainings" className="hover:text-secondary transition duration-300">{settings?.navTrainings || 'التداريب'}</Link>
            <Link to="/store" className="hover:text-secondary transition duration-300">{settings?.navStore || 'المتجر'}</Link>
            <Link to="/gallery" className="hover:text-secondary transition duration-300">المعرض</Link>
          </div>

          {/* زر التسجيل السريع فـ البيسي */}
          <div className="hidden md:block">
            <Link to="/register" className="bg-secondary hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg transition shadow-md whitespace-nowrap">
              {settings?.registerButtonText || 'سجل ولدك الآن'}
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
        <div className="flex flex-col px-6 py-4 space-y-4 font-bold text-lg text-white">
          <Link to="/" onClick={closeMenu} className="block hover:text-secondary transition">{settings?.navHome || 'الرئيسية'}</Link>
          <Link to="/news" onClick={closeMenu} className="block hover:text-secondary transition">{settings?.navNews || 'الأخبار'}</Link>
          <Link to="/matches" onClick={closeMenu} className="block hover:text-secondary transition">{settings?.navMatches || 'المباريات'}</Link>
          <Link to="/players" onClick={closeMenu} className="block hover:text-secondary transition">{settings?.navPlayers || 'اللاعبين'}</Link>
          <Link to="/trainings" onClick={closeMenu} className="block hover:text-secondary transition">{settings?.navTrainings || 'التداريب'}</Link>
          <Link to="/store" onClick={closeMenu} className="block hover:text-secondary transition">{settings?.navStore || 'المتجر'}</Link>
          <Link to="/gallery" onClick={closeMenu} className="block hover:text-secondary transition">المعرض</Link>
          
          <div className="pt-4 border-t border-white/10">
            <Link to="/register" onClick={closeMenu} className="block text-center bg-secondary text-white py-3 rounded-lg shadow-md transition hover:bg-opacity-90">
              {settings?.registerButtonText || 'سجل ولدك الآن'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

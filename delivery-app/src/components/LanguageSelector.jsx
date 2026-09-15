import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Check, X } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'pill' }) {
  const { currentLang, changeLanguage, setCurrentLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeLanguage = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const handleSelect = (code) => {
    if (typeof changeLanguage === 'function') {
      changeLanguage(code);
    } else if (typeof setCurrentLang === 'function') {
      setCurrentLang(code);
    }
    localStorage.setItem('homepot_rider_lang', code);
    setIsOpen(false);
  };

  return (
    <>
      {variant === 'round' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#8C4A32] hover:bg-white transition-all shadow-xs cursor-pointer active:scale-95"
          title="Change Language"
        >
          <Globe size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#EADBCC] text-[#8C4A32] text-xs font-bold hover:bg-white transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Globe size={14} />
          <span>{activeLanguage.label}</span>
        </button>
      )}

      {/* Floating Modal via Portal */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans"
          style={{ colorScheme: 'light' }}
        >
          <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl w-full max-w-xs shadow-2xl p-5 flex flex-col gap-4 relative text-[#2C231E]">
            <div className="flex justify-between items-center border-b border-[#EADBCC] pb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#8C4A32]" />
                <h3 className="font-serif font-bold text-base text-[#2C231E]">
                  {t('preferences') || 'Select Language'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#6C645E] hover:bg-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#8C4A32] text-white border-[#8C4A32] shadow-sm font-bold'
                        : 'bg-white/80 text-[#333C3E] border-[#EADBCC] hover:bg-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <p className="text-xs">{lang.label}</p>
                        <p className={`text-[10px] ${isSelected ? 'text-orange-200' : 'text-[#7C746E]'}`}>
                          {lang.name}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

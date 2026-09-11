import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Check, X } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'pill' }) {
  const { currentLang, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      {/* Trigger Button */}
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-[#F4EFE6] text-[#8C4A32] border border-[#E2D5BE] px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs transition cursor-pointer active:scale-95"
          title={t('choose_language')}
        >
          <Globe className="w-3.5 h-3.5 text-[#A0523D]" />
          <span>{currentObj.label}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 rounded-full bg-[#A85E45] flex items-center justify-center hover:bg-[#783D29] transition cursor-pointer text-white relative shadow-xs"
          title={t('choose_language')}
        >
          <Globe className="w-4 h-4" />
        </button>
      )}

      {/* Language Selection Modal rendered via Portal to escape all stacking contexts */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border border-[#E2D5BE] flex flex-col gap-3 text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-[#FAF6F0] text-[#A0523D] border border-[#E8DEC8]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#2C1D14]">
                    {t('choose_language')}
                  </h3>
                  <p className="text-[10px] text-[#6B5B4F]">Select your native language</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Options Grid */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-start gap-1 transition-all cursor-pointer active:scale-95 text-left ${
                      isSelected
                        ? 'bg-[#A0523D] text-white border-[#8C4A32] shadow-sm'
                        : 'bg-[#FAF6F0] text-[#2C1D14] border-[#E8DEC8] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-bold">{lang.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </div>
                    <span className={`text-[10px] ${isSelected ? 'text-orange-100' : 'text-[#8C4A32]'}`}>
                      {lang.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[9px] text-[#A39281] text-center mt-1">
              அம்மாக்கள் மற்றும் இல்லத்தரசிகளுக்கு எளிதான மொழி ஆதரவு
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

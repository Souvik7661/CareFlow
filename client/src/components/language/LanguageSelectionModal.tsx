import React, { useState, useMemo } from 'react';
import { Search, Globe2, Check, Sparkles, X, ChevronDown, ArrowRight } from 'lucide-react';
import { LANGUAGES, Language } from '../../i18n/languages';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onSelectLanguage?: (langCode: string) => void;
  onClose?: () => void;
  allowClose?: boolean;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onSelectLanguage,
  onClose,
  allowClose = false
}) => {
  const { currentLanguage, setLanguageWithTransition, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>(currentLanguage || 'en');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);

  // Filter languages in real-time
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(lang => 
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      (lang.region && lang.region.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleLanguageClick = (langCode: string) => {
    setSelectedCode(langCode);
    setLanguageWithTransition(langCode, () => {
      if (onSelectLanguage) {
        onSelectLanguage(langCode);
      }
    });
  };

  const handleConfirm = () => {
    setLanguageWithTransition(selectedCode, () => {
      if (onSelectLanguage) {
        onSelectLanguage(selectedCode);
      }
    });
  };

  const selectedObj = LANGUAGES.find(l => l.code === selectedCode) || LANGUAGES[0];

  return (
    <div
      className="cf-lang-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: 'rgba(8, 9, 13, 0.78)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.22s ease-out'
      }}
    >
      <div
        className="liquid-chrome-tray"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '32px',
          padding: '28px 24px 24px 24px',
          boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(45, 212, 191, 0.2)',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Optional Close button (if reopened from header) */}
        {allowClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'radial-gradient(circle at 35% 35%, rgba(45, 212, 191, 0.25) 0%, rgba(13, 148, 136, 0.1) 100%)',
              border: '1.5px solid rgba(45, 212, 191, 0.5)',
              boxShadow: '0 8px 24px rgba(45, 212, 191, 0.25)',
              marginBottom: '12px',
              color: '#2dd4bf'
            }}
          >
            <Globe2 size={28} />
          </div>

          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            {t('common.selectLanguage', 'Select Your Preferred Language')}
          </h2>

          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.45,
              maxWidth: '440px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {t('common.selectLanguageSubtitle', 'Choose your language for clinical consultations, triage & Dr. AI guidance')}
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            marginBottom: '14px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.searchLanguagePlaceholder', 'Search language (e.g. English, Hindi, Español, বাংলা)...')}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 38px 12px 42px',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 500,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxShadow: 'inset 0 1.5px 3px rgba(0, 0, 0, 0.1)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results / Language Dropdown Menu */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '340px',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '18px'
          }}
        >
          {filteredLanguages.length === 0 ? (
            <div
              style={{
                padding: '30px 16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.88rem'
              }}
            >
              {t('common.noLanguagesFound', 'No matching languages found')}
            </div>
          ) : (
            filteredLanguages.map((lang: Language) => {
              const isSelected = selectedCode === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => handleLanguageClick(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: isSelected 
                      ? 'linear-gradient(90deg, rgba(45, 212, 191, 0.18) 0%, rgba(13, 148, 136, 0.12) 100%)' 
                      : 'var(--bg-card)',
                    border: isSelected 
                      ? '1.5px solid #2dd4bf' 
                      : '1px solid var(--border-color)',
                    boxShadow: isSelected 
                      ? '0 6px 20px rgba(13, 148, 136, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)' 
                      : '0 2px 6px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isSelected ? 'scale(1.01)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{lang.flag}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                          {lang.name}
                        </span>

                        {/* Explicit "(Default)" label beside English */}
                        {lang.isDefault && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.5)',
                              boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
                              letterSpacing: '0.02em'
                            }}
                          >
                            (Default)
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <span style={{ fontWeight: 600 }}>{lang.nativeName}</span>
                        {lang.region && <span style={{ opacity: 0.7 }}> • {lang.region}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Active Selection Check Indicator */}
                  {isSelected ? (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#2dd4bf',
                        color: '#0e0f12',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 12px #2dd4bf'
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '1.5px solid var(--border-color)',
                        opacity: 0.5
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span>Selected:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedObj.flag} {selectedObj.name} {selectedObj.isDefault ? '(Default)' : ''}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            style={{
              padding: '10px 24px',
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{t('common.applyLanguage', 'Apply & Continue')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

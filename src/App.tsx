import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSecretSantaStore } from './stores/useSecretSantaStore';
import { ParticipantForm } from './components/ParticipantForm';
import { ParticipantList } from './components/ParticipantList';
import { ExclusionRules } from './components/ExclusionRules';
import DrawButton from './components/DrawButton';
import { ToastContainer } from './components/ToastContainer';
import type { Language } from './types';

type Tab = 'participants' | 'exclusions';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('participants');
  const language = useSecretSantaStore((state) => state.language);
  const setLanguage = useSecretSantaStore((state) => state.setLanguage);
  const participants = useSecretSantaStore((state) => state.participants);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">{t('title')}</h1>
            <p className="text-xl text-gray-200">{t('subtitle')}</p>
            <button
              onClick={toggleLanguage}
              className="mt-4 text-sm text-primary hover:text-primary-dark transition-colors underline focus-visible-ring rounded px-2 py-1"
              aria-label={t('languageSwitch')}
            >
              {t('languageSwitch')}
            </button>
          </header>

          <main id="main-content" className="space-y-8">
            <section className="card-festive">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('participantsAndExclusions')}
              </h2>

              <div
                className="flex gap-2 mb-6 border-b-2 border-gray-200"
                role="tablist"
                aria-label="Participant and Exclusion Management"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'participants'}
                  aria-controls="participants-panel"
                  id="participants-tab"
                  onClick={() => setActiveTab('participants')}
                  className={`px-6 py-3 font-semibold transition-all ${
                    activeTab === 'participants'
                      ? 'text-primary border-b-4 border-primary -mb-0.5'
                      : 'text-gray-600 hover:text-gray-900'
                  } focus-visible-ring rounded-t`}
                >
                  {t('participantsTab', { count: participants.length })}
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'exclusions'}
                  aria-controls="exclusions-panel"
                  id="exclusions-tab"
                  onClick={() => setActiveTab('exclusions')}
                  className={`px-6 py-3 font-semibold transition-all ${
                    activeTab === 'exclusions'
                      ? 'text-primary border-b-4 border-primary -mb-0.5'
                      : 'text-gray-600 hover:text-gray-900'
                  } focus-visible-ring rounded-t`}
                >
                  {t('exclusionsTab')}
                </button>
              </div>

              <div
                role="tabpanel"
                id="participants-panel"
                aria-labelledby="participants-tab"
                hidden={activeTab !== 'participants'}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {t('addParticipant')}
                    </h3>
                    <ParticipantForm />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {t('participants')} ({participants.length})
                    </h3>
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                      <ParticipantList />
                    </div>
                  </div>
                </div>
              </div>

              <div
                role="tabpanel"
                id="exclusions-panel"
                aria-labelledby="exclusions-tab"
                hidden={activeTab !== 'exclusions'}
              >
                <div className="max-w-2xl mx-auto">
                  <ExclusionRules />
                </div>
              </div>
            </section>

            <section className="card-festive">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {t('drawAndSend')}
              </h2>
              <DrawButton />
            </section>
          </main>

        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default App;

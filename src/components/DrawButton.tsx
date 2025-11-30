import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSecretSantaStore } from '../stores/useSecretSantaStore';
import { CONFIG } from '../constants/config';
import { validateEmailConfig } from '../utils/emailService';

const DrawButton = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const participants = useSecretSantaStore((state) => state.participants);
  const exclusions = useSecretSantaStore((state) => state.exclusions);
  const emailConfig = useSecretSantaStore((state) => state.emailConfig);
  const emailProgress = useSecretSantaStore((state) => state.emailProgress);
  const performDraw = useSecretSantaStore((state) => state.performDraw);
  const sendEmails = useSecretSantaStore((state) => state.sendEmails);
  const addToast = useSecretSantaStore((state) => state.addToast);

  const minRequired =
    exclusions.length > 0
      ? CONFIG.MIN_PARTICIPANTS_WITH_EXCLUSIONS
      : CONFIG.MIN_PARTICIPANTS_WITHOUT_EXCLUSIONS;

  const canDraw = participants.length >= minRequired;

  const handleDraw = async () => {
    if (!validateEmailConfig(emailConfig)) {
      addToast({
        type: 'error',
        message: t('messages.error.emailConfigMissing'),
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await performDraw();

      if (!result.success) {
        addToast({
          type: 'error',
          message: t('messages.error.drawFailed'),
        });
        setIsLoading(false);
        return;
      }

      addToast({
        type: 'success',
        message: t('messages.success.drawSuccess'),
      });

      await sendEmails(result.assignments);
    } catch (error) {
      console.error('Draw and send failed:', error);
      addToast({
        type: 'error',
        message: t('messages.error.drawFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-800 font-medium">{t('secretInfo')}</p>
      </div>

      <button
        onClick={handleDraw}
        disabled={!canDraw || isLoading}
        className="btn-primary w-full text-lg py-4"
        aria-busy={isLoading}
      >
        {isLoading ? t('ui.buttonDrawing') : t('startDraw')}
      </button>

      {!canDraw && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {t('messages.error.minParticipantsRequired', { min: minRequired })}
        </p>
      )}

      {emailProgress && (
        <div
          className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-500"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{t('emailProgress')}</span>
            <span className="text-sm text-gray-600">
              {emailProgress.sent} / {emailProgress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{
                width: `${(emailProgress.sent / emailProgress.total) * 100}%`,
              }}
              role="progressbar"
              aria-valuenow={emailProgress.sent}
              aria-valuemin={0}
              aria-valuemax={emailProgress.total}
              aria-label="Email sending progress"
            />
          </div>
          {emailProgress.currentRecipient && (
            <p className="text-xs text-gray-500 mt-2">
              Sending to: {emailProgress.currentRecipient}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
export default DrawButton

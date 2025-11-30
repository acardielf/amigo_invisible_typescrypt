import { useTranslation } from 'react-i18next';
import { useSecretSantaStore } from '../stores/useSecretSantaStore';
import { ICONS } from '../constants/config';

export const ParticipantList = () => {
  const { t } = useTranslation();
  const participants = useSecretSantaStore((state) => state.participants);
  const removeParticipant = useSecretSantaStore((state) => state.removeParticipant);
  const addToast = useSecretSantaStore((state) => state.addToast);

  const handleRemove = (email: string, name: string) => {
    if (globalThis.confirm(t('messages.warning.confirmDeleteParticipant', { name }))) {
      removeParticipant(email);
      addToast({
        type: 'success',
        message: t('messages.success.participantRemoved', { name }),
      });
    }
  };

  if (participants.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">{t('emptyParticipants')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-3" aria-label={t('participants')}>
        {participants.map((participant) => (
          <li key={participant.email} className="list-item">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {participant.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {participant.email}
                </p>
                {participant.wishes && (
                  <p className="text-sm text-gray-500 mt-2">
                    {participant.wishes}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemove(participant.email, participant.name)}
                className="btn-danger flex items-center gap-1 shrink-0"
                aria-label={`Remove ${participant.name}`}
              >
                <span aria-hidden="true">{ICONS.trash}</span>
                <span className="sr-only">Remove</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-sm text-gray-600 mt-4 text-center" role="status" aria-live="polite">
        {t('participantsTab', { count: participants.length })}
      </div>
    </div>
  );
};

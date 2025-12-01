import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSecretSantaStore } from '../stores/useSecretSantaStore';
import { exclusionSchema } from '../utils/validation';
import type { ExclusionFormData } from '../utils/validation';
import { ICONS } from '../constants/config';
import { isExcluded } from '../utils/drawingAlgorithm';
import { FormField } from './FormField';

export const ExclusionRules = () => {
  const { t } = useTranslation();
  const participants = useSecretSantaStore((state) => state.participants);
  const exclusions = useSecretSantaStore((state) => state.exclusions);
  const addExclusion = useSecretSantaStore((state) => state.addExclusion);
  const removeExclusion = useSecretSantaStore((state) => state.removeExclusion);
  const addToast = useSecretSantaStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExclusionFormData>({
    resolver: zodResolver(exclusionSchema),
  });

  const onSubmit = (data: ExclusionFormData) => {
    if (isExcluded(data.email1, data.email2, exclusions)) {
      addToast({
        type: 'error',
        message: t('messages.error.exclusionDuplicate'),
      });
      return;
    }

    addExclusion({
      email1: data.email1,
      email2: data.email2,
    });

    addToast({
      type: 'success',
      message: t('messages.success.exclusionAdded'),
    });

    reset();
  };

  const handleRemove = (email1: string, email2: string) => {
    if (globalThis.confirm(t('messages.warning.confirmDeleteExclusion'))) {
      removeExclusion(email1, email2);
      addToast({
        type: 'success',
        message: t('messages.success.exclusionRemoved'),
      });
    }
  };

  const getParticipantName = (email: string) => {
    return participants.find((p) => p.email === email)?.name || email;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-sm text-blue-800">{t('exclusionsHint')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          type="select"
          name="email1"
          label={t('person1')}
          register={register('email1')}
          error={errors.email1?.message}
          placeholder={t('selectPlaceholder')}
          disabled={participants.length === 0}
          required
        >
          {participants.map((p) => (
            <option key={p.email} value={p.email}>
              {p.name}
            </option>
          ))}
        </FormField>

        <FormField
          type="select"
          name="email2"
          label={t('person2')}
          register={register('email2')}
          error={errors.email2?.message}
          placeholder={t('selectPlaceholder')}
          disabled={participants.length === 0}
          required
        >
          {participants.map((p) => (
            <option key={p.email} value={p.email}>
              {p.name}
            </option>
          ))}
        </FormField>

        <button
          type="submit"
          disabled={participants.length < 2}
          className="btn-secondary w-full"
        >
          {t('addExclusion')}
        </button>
      </form>

      {exclusions.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">{t('exclusionsTab')}</h3>
          <ul className="space-y-2" aria-label={t('exclusions')}>
            {exclusions.map((exclusion) => (
              <li key={`${exclusion.email1}-${exclusion.email2}`} className="list-item">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-medium text-black">{getParticipantName(exclusion.email1)}</span>
                    <span className="text-gray-400" aria-hidden="true">↔</span>
                    <span className="font-medium text-black">{getParticipantName(exclusion.email2)}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(exclusion.email1, exclusion.email2)}
                    className="btn-danger flex items-center gap-1 shrink-0"
                    aria-label={`Remove exclusion between ${getParticipantName(
                      exclusion.email1
                    )} and ${getParticipantName(exclusion.email2)}`}
                  >
                    <span aria-hidden="true">{ICONS.trash}</span>
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {exclusions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{t('emptyExclusions')}</p>
        </div>
      )}
    </div>
  );
};

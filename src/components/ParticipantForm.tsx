import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSecretSantaStore } from '../stores/useSecretSantaStore';
import { participantSchema } from '../utils/validation';
import type { ParticipantFormData } from '../utils/validation';
import { CONFIG } from '../constants/config';
import { FormField } from './FormField';

export const ParticipantForm = () => {
  const { t } = useTranslation();
  const addParticipant = useSecretSantaStore((state) => state.addParticipant);
  const participants = useSecretSantaStore((state) => state.participants);
  const addToast = useSecretSantaStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(participantSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ParticipantFormData) => {
    const isDuplicate = participants.some(
      (p) => p.email.toLowerCase() === data.email.toLowerCase()
    );

    if (isDuplicate) {
      addToast({
        type: 'error',
        message: t('messages.error.emailDuplicate'),
      });
      return;
    }

    try {
      addParticipant({
        name: data.name,
        email: data.email.toLowerCase(),
        wishes: data.wishes || '',
      });

      addToast({
        type: 'success',
        message: t('messages.success.participantAdded', { name: data.name }),
      });

      reset();
    } catch {
      addToast({
        type: 'error',
        message: t('messages.error.participantAddError'),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField
        type="text"
        name="name"
        label={t('name')}
        register={register('name')}
        error={errors.name?.message}
        placeholder={t('namePlaceholder')}
        maxLength={CONFIG.MAX_NAME_LENGTH}
        required
      />

      <FormField
        type="email"
        name="email"
        label={t('email')}
        register={register('email')}
        error={errors.email?.message}
        placeholder={t('emailPlaceholder')}
        maxLength={CONFIG.MAX_EMAIL_LENGTH}
        required
      />

      <FormField
        type="textarea"
        name="wishes"
        label={t('wishlist')}
        register={register('wishes')}
        error={errors.wishes?.message}
        placeholder={t('wishlistPlaceholder')}
        rows={3}
        maxLength={500}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? '...' : t('addButton')}
      </button>
    </form>
  );
};

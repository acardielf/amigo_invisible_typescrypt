import type { AppConfig } from '../types';

export const CONFIG: AppConfig = {
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 254,
  MAX_DRAW_ATTEMPTS: 1000,
  MAX_EMAIL_SEND_RETRIES: 1,
  EMAIL_RETRY_BASE_DELAY_MS: 1000,
  MIN_PARTICIPANTS_WITHOUT_EXCLUSIONS: 3,
  MIN_PARTICIPANTS_WITH_EXCLUSIONS: 4,
  EMAIL_RATE_LIMIT_MS: 500,
  TOAST_DISPLAY_DURATION_MS: 4000,
  TOAST_ANIMATION_DELAY_MS: 10,
  TOAST_FADE_OUT_DURATION_MS: 300,
  PROGRESS_HIDE_DELAY_MS: 3000,
  STORAGE_KEY: 'amigo_invisible',
  DEFAULT_LANGUAGE: 'es',
};

export const ICONS = {
  checkmark: '✅',
  info: 'ℹ️',
  trash: '🗑️',
} as const;

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

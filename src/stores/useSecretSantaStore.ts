import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import i18next from 'i18next';
import type {
  SecretSantaState,
  Participant,
  Exclusion,
  Language,
  EmailConfig,
  Toast,
  EmailProgress,
  Assignment,
  DrawResult,
} from '../types';
import { CONFIG } from '../constants/config';
import { performSecretSantaDraw } from '../utils/drawingAlgorithm';
import { orchestrateEmailSending } from '../services/emailOrchestrator';

export const useSecretSantaStore = create<SecretSantaState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        participants: [],
        exclusions: [],
        language: CONFIG.DEFAULT_LANGUAGE,
        emailConfig: null,
        toasts: [],
        emailProgress: null,
        isDrawing: false,

        // Participant Actions
        addParticipant: (participant: Participant) => {
          set((state) => ({
            participants: [...state.participants, participant],
          }));
        },

        removeParticipant: (email: string) => {
          set((state) => ({
            participants: state.participants.filter((p) => p.email !== email),
            exclusions: state.exclusions.filter(
              (e) => e.email1 !== email && e.email2 !== email
            ),
          }));
        },

        // Exclusion Actions
        addExclusion: (exclusion: Exclusion) => {
          set((state) => ({
            exclusions: [...state.exclusions, exclusion],
          }));
        },

        removeExclusion: (email1: string, email2: string) => {
          set((state) => ({
            exclusions: state.exclusions.filter(
              (e) =>
                !(
                  (e.email1 === email1 && e.email2 === email2) ||
                  (e.email1 === email2 && e.email2 === email1)
                )
            ),
          }));
        },

        // Language Actions
        setLanguage: (language: Language) => {
          set({ language });
        },

        // Email Config Actions
        setEmailConfig: (config: EmailConfig) => {
          set({ emailConfig: config });
        },

        // Drawing Action
        performDraw: async (): Promise<DrawResult> => {
          const { participants, exclusions } = get();

          set({ isDrawing: true });

          try {
            const result = performSecretSantaDraw(participants, exclusions);
            return result;
          } catch (error) {
            console.error('Draw failed:', error);
            return {
              success: false,
              assignments: [],
            };
          } finally {
            set({ isDrawing: false });
          }
        },

        // Email Sending Action
        sendEmails: async (assignments: Assignment[]) => {
          const { emailConfig, setEmailProgress, addToast } = get();

          if (!emailConfig) {
            addToast({
              type: 'error',
              message: i18next.t('messages.error.emailConfigMissing'),
            });
            return;
          }

          await orchestrateEmailSending(assignments, emailConfig, {
            onProgress: setEmailProgress,
            onSuccess: (count) =>
              addToast({
                type: 'success',
                message: i18next.t('messages.success.allEmailsSent', { count }),
              }),
            onError: (name) =>
              addToast({
                type: 'error',
                message: i18next.t('messages.error.emailSendError', { name }),
              }),
            onComplete: () => setEmailProgress(null),
          });
        },

        // Toast Actions
        addToast: (toast: Omit<Toast, 'id'>) => {
          const id = `toast-${Date.now()}-${Math.random()}`;
          const newToast: Toast = {
            ...toast,
            id,
            duration: toast.duration || CONFIG.TOAST_DISPLAY_DURATION_MS,
          };

          set((state) => ({
            toasts: [...state.toasts, newToast],
          }));

          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        },

        removeToast: (id: string) => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        },

        setEmailProgress: (progress: EmailProgress | null) => {
          set({ emailProgress: progress });
        },

        // Clear all data
        clearAllData: () => {
          set({
            participants: [],
            exclusions: [],
            language: CONFIG.DEFAULT_LANGUAGE,
            toasts: [],
            emailProgress: null,
          });
          localStorage.removeItem(CONFIG.STORAGE_KEY);
        },
      }),
      {
        name: CONFIG.STORAGE_KEY,
      }
    ),
    { name: 'SecretSantaStore' }
  )
);

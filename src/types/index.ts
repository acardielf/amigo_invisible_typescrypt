// Participant & Exclusion Types
export interface Participant {
  name: string;
  email: string;
  wishes: string;
}

export interface Exclusion {
  email1: string;
  email2: string;
}

// Drawing & Assignment Types
export interface Assignment {
  giver: Participant;
  recipient: Participant;
}

export interface DrawResult {
  success: boolean;
  assignments: Assignment[];
  attempts?: number;
}

// Email Types
export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface EmailTemplateParams extends Record<string, unknown> {
  to_name: string;
  to_email: string;
  recipient_name: string;
  recipient_email: string;
  recipient_wishes: string;
}

export interface EmailJSResponse {
  status: number;
  text: string;
}

export interface EmailProgress {
  sent: number;
  total: number;
  currentRecipient?: string;
}

// Toast/Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Language Types
export type Language = 'es' | 'de' | 'en';

// Config Type
export interface AppConfig {
  MAX_NAME_LENGTH: number;
  MAX_EMAIL_LENGTH: number;
  MAX_DRAW_ATTEMPTS: number;
  MAX_EMAIL_SEND_RETRIES: number;
  EMAIL_RETRY_BASE_DELAY_MS: number;
  MIN_PARTICIPANTS_WITHOUT_EXCLUSIONS: number;
  MIN_PARTICIPANTS_WITH_EXCLUSIONS: number;
  EMAIL_RATE_LIMIT_MS: number;
  TOAST_DISPLAY_DURATION_MS: number;
  TOAST_ANIMATION_DELAY_MS: number;
  TOAST_FADE_OUT_DURATION_MS: number;
  PROGRESS_HIDE_DELAY_MS: number;
  STORAGE_KEY: string;
  DEFAULT_LANGUAGE: Language;
}

// Zustand Store State
export interface SecretSantaState {
  // Data
  participants: Participant[];
  exclusions: Exclusion[];
  language: Language;
  emailConfig: EmailConfig | null;

  // UI State
  toasts: Toast[];
  emailProgress: EmailProgress | null;
  isDrawing: boolean;

  // Actions - Participants
  addParticipant: (participant: Participant) => void;
  removeParticipant: (email: string) => void;

  // Actions - Exclusions
  addExclusion: (exclusion: Exclusion) => void;
  removeExclusion: (email1: string, email2: string) => void;

  // Actions - Language
  setLanguage: (language: Language) => void;

  // Actions - Email Config
  setEmailConfig: (config: EmailConfig) => void;

  // Actions - Drawing
  performDraw: () => Promise<DrawResult>;
  sendEmails: (assignments: Assignment[]) => Promise<void>;

  // Actions - UI
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setEmailProgress: (progress: EmailProgress | null) => void;

  // Actions - Storage
  clearAllData: () => void;
}

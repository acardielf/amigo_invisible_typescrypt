import emailjs from '@emailjs/browser';
import type { Participant, EmailConfig, EmailTemplateParams, EmailJSResponse } from '../types';
import { CONFIG } from '../constants/config';

export const initializeEmailJS = (publicKey: string): void => {
  emailjs.init(publicKey);
};

const calculateRetryDelay = (attempt: number): number => {
  return Math.pow(2, attempt) * CONFIG.EMAIL_RETRY_BASE_DELAY_MS;
};

export const sendEmailToParticipant = async (
  giver: Participant,
  recipient: Participant,
  emailConfig: EmailConfig
): Promise<EmailJSResponse> => {
  const templateParams: EmailTemplateParams = {
    to_name: giver.name,
    to_email: giver.email,
    recipient_name: recipient.name,
    recipient_email: recipient.email,
    recipient_wishes: recipient.wishes || 'No specific wishes provided',
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < CONFIG.MAX_EMAIL_SEND_RETRIES; attempt++) {
    try {
      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`Email send attempt ${attempt + 1} failed:`, error);

      if (attempt < CONFIG.MAX_EMAIL_SEND_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, calculateRetryDelay(attempt)));
      }
    }
  }

  throw lastError || new Error('Failed to send email after retries');
};

export const validateEmailConfig = (config: EmailConfig | null): boolean => {
  return !!(config?.serviceId && config.templateId && config.publicKey);
};

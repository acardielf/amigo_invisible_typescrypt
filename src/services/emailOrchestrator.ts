import type { Assignment, EmailConfig, EmailProgress } from '../types';
import { sendEmailToParticipant } from '../utils/emailService';
import { CONFIG } from '../constants/config';

interface EmailOrchestrationCallbacks {
  onProgress: (progress: EmailProgress) => void;
  onSuccess: (count: number) => void;
  onError: (participantName: string) => void;
  onComplete: () => void;
}

export const orchestrateEmailSending = async (
  assignments: Assignment[],
  emailConfig: EmailConfig,
  callbacks: EmailOrchestrationCallbacks
): Promise<void> => {
  const total = assignments.length;
  let sent = 0;

  for (const assignment of assignments) {
    try {
      callbacks.onProgress({
        sent,
        total,
        currentRecipient: assignment.giver.name,
      });

      await sendEmailToParticipant(
        assignment.giver,
        assignment.recipient,
        emailConfig
      );

      sent++;

      callbacks.onProgress({
        sent,
        total,
        currentRecipient: assignment.giver.name,
      });

      if (sent < total) {
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.EMAIL_RATE_LIMIT_MS)
        );
      }
    } catch (error) {
      console.error(
        `Failed to send email to ${assignment.giver.email}:`,
        error
      );
      callbacks.onError(assignment.giver.name);
    }
  }

  setTimeout(() => {
    callbacks.onComplete();
  }, CONFIG.PROGRESS_HIDE_DELAY_MS);

  if (sent === total) {
    callbacks.onSuccess(total);
  }
};

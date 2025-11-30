import { z } from 'zod';
import { CONFIG, EMAIL_REGEX } from '../constants/config';

export const participantSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(CONFIG.MAX_NAME_LENGTH, `Name must be at most ${CONFIG.MAX_NAME_LENGTH} characters`),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(
      CONFIG.MAX_EMAIL_LENGTH,
      `Email must be at most ${CONFIG.MAX_EMAIL_LENGTH} characters`
    )
    .regex(EMAIL_REGEX, 'Invalid email format'),
  wishes: z.string().max(500, 'Wishes must be at most 500 characters').optional().default(''),
});

export const exclusionSchema = z
  .object({
    email1: z.string().min(1, 'Please select the first person'),
    email2: z.string().min(1, 'Please select the second person'),
  })
  .refine((data) => data.email1 !== data.email2, {
    message: 'A person cannot be excluded from themselves',
    path: ['email2'],
  });

export const emailConfigSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  publicKey: z.string().min(1, 'Public key is required'),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;
export type ExclusionFormData = z.infer<typeof exclusionSchema>;

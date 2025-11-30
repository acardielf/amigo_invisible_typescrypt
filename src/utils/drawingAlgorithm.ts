import type { Participant, Exclusion, Assignment, DrawResult } from '../types';
import { CONFIG } from '../constants/config';

/**
 * Fisher-Yates shuffle algorithm
 * Randomly shuffles an array in-place
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Check if two participants are excluded from gifting each other
 */
export const isExcluded = (
  email1: string,
  email2: string,
  exclusions: Exclusion[]
): boolean => {
  return exclusions.some(
    (exclusion) =>
      (exclusion.email1 === email1 && exclusion.email2 === email2) ||
      (exclusion.email1 === email2 && exclusion.email2 === email1)
  );
};

/**
 * Check if an assignment is valid (not self-gifting and not excluded)
 */
const isValidAssignment = (
  giver: Participant,
  recipient: Participant,
  exclusions: Exclusion[]
): boolean => {
  return (
    giver.email !== recipient.email &&
    !isExcluded(giver.email, recipient.email, exclusions)
  );
};

/**
 * Attempt to create a valid assignment using ring structure
 * Returns null if this attempt fails due to exclusion rules
 */
const attemptAssignment = (
  participants: Participant[],
  exclusions: Exclusion[]
): Assignment[] | null => {
  const shuffled = shuffleArray([...participants]);
  const assignments: Assignment[] = [];

  // Create a ring structure: A → B → C → ... → A
  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i];
    const recipient = shuffled[(i + 1) % shuffled.length];

    if (!isValidAssignment(giver, recipient, exclusions)) {
      return null; // This attempt failed, try again
    }

    assignments.push({ giver, recipient });
  }

  return assignments;
};

/**
 * Main function to perform Secret Santa draw
 * Attempts to create valid assignments with multiple retries
 */
export const performSecretSantaDraw = (
  participants: Participant[],
  exclusions: Exclusion[]
): DrawResult => {
  // Validation
  if (participants.length < CONFIG.MIN_PARTICIPANTS_WITHOUT_EXCLUSIONS) {
    return {
      success: false,
      assignments: [],
    };
  }

  if (
    exclusions.length > 0 &&
    participants.length < CONFIG.MIN_PARTICIPANTS_WITH_EXCLUSIONS
  ) {
    return {
      success: false,
      assignments: [],
    };
  }

  // Try to create a valid assignment
  for (let attempt = 0; attempt < CONFIG.MAX_DRAW_ATTEMPTS; attempt++) {
    const assignments = attemptAssignment(participants, exclusions);

    if (assignments) {
      return {
        success: true,
        assignments,
        attempts: attempt + 1,
      };
    }
  }

  // Failed after max attempts
  return {
    success: false,
    assignments: [],
    attempts: CONFIG.MAX_DRAW_ATTEMPTS,
  };
};

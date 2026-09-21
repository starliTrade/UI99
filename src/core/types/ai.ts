/**
 * SAFA — AI Provider Abstraction Types
 * Structured AI operations: Understand, Extract, Classify, Connect, Reason, Suggest, Plan, Act.
 * Validation pipeline: AI suggests -> System validates schema & permissions -> User confirms.
 */

export enum AIOperationType {
  UNDERSTAND = 'UNDERSTAND',
  EXTRACT = 'EXTRACT',
  CLASSIFY = 'CLASSIFY',
  CONNECT = 'CONNECT',
  REASON = 'REASON',
  SUGGEST = 'SUGGEST',
  PLAN = 'PLAN',
  ACT = 'ACT',
}

export interface AIExtractResult {
  suggestedType: string;
  cleanTitle: string;
  cleanDescription?: string;
  suggestedTags: string[];
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  relatedEntitiesMentioned?: string[];
  sentiment?: string;
  language?: 'en' | 'fa';
  confidence: number;
}

export interface AISuggestion {
  id: string;
  type: 'CONNECT_OBJECTS' | 'ORGANIZE_INBOX' | 'SCHEDULE_TASK' | 'REFINE_IDEA' | 'HABIT_NUDGE';
  title: string;
  explanation: string;
  actionPayload: Record<string, any>;
  requiresConfirmation: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'DISMISSED';
}

export interface AIProviderStatus {
  providerName: string;
  model: string;
  isAvailable: boolean;
  serverSideConnected: boolean;
  supportsPersian: boolean;
}

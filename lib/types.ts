import { User } from '@prisma/client';

export interface Case {
  id: string;
  caseType: 'FAMILY' | 'BUSINESS' | 'CRIMINAL' | 'COMMUNITY' | 'OTHER';
  description: string;
  status:
    | 'PENDING'
    | 'AWAITING_RESPONSE'
    | 'ACCEPTED'
    | 'PANEL_CREATED'
    | 'MEDIATION_IN_PROGRESS'
    | 'RESOLVED'
    | 'UNRESOLVED';
  legalStatus?: 'PENDING_IN_COURT' | 'PENDING_IN_POLICE' | 'NOT_REGISTERED';
  legalExtraInfo?: string;
  proofFiles: string[];
  createdAt: string;
  updatedAt: string;
  claimant: User;
  oppositeParty: User;
}

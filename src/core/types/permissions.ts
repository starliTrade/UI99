/**
 * SAFA — Permission Model
 * Private-by-default architecture with granular access control and SLO integration.
 */

export enum PermissionLevel {
  PRIVATE = 'PRIVATE',
  VIEW = 'VIEW',
  COMMENT = 'COMMENT',
  EDIT = 'EDIT',
  RESAVE = 'RESAVE',
  RESHARE = 'RESHARE',
  DOWNLOAD = 'DOWNLOAD',
}

export interface AccessControlRule {
  targetUserId: string; // e.g. "slo_partner_id" or specific contact
  level: PermissionLevel;
  grantedAt: string;
  expiresAt?: string;
}

export interface SLOPermissionConfig {
  connectionId: string;
  connectionName: string; // Default: 'SLO'
  isConnected: boolean;
  defaultAccess: 'NO_ACCESS' | 'SELECTIVE';
  allowedObjectTypes: string[]; // e.g. ['PHOTO', 'MEMORY', 'TRIP']
  canViewMoments: boolean;
  canViewCalendar: boolean;
}

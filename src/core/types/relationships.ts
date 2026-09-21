/**
 * SAFA — Relationship Model
 * First-class relationship graph architecture connecting any Universal Object.
 */

export enum RelationshipType {
  RELATED_TO = 'RELATED_TO',
  PART_OF = 'PART_OF',
  BELONGS_TO = 'BELONGS_TO',
  CREATED_FROM = 'CREATED_FROM',
  INSPIRED_BY = 'INSPIRED_BY',
  ATTACHED_TO = 'ATTACHED_TO',
  DERIVED_FROM = 'DERIVED_FROM',
  DEPENDS_ON = 'DEPENDS_ON',
  BLOCKS = 'BLOCKS',
  MENTIONS = 'MENTIONS',
  LOCATED_AT = 'LOCATED_AT',
  HAPPENED_AT = 'HAPPENED_AT',
  CREATED_BY = 'CREATED_BY',
  SHARED_WITH = 'SHARED_WITH',
  FAVORITED_BY = 'FAVORITED_BY',
  REMEMBERS = 'REMEMBERS',
  CONTRIBUTES_TO = 'CONTRIBUTES_TO',
  ABOUT = 'ABOUT',
}

export interface Relationship {
  id: string;
  type: RelationshipType;
  sourceObjectId: string;
  targetObjectId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  permissions?: {
    isPrivate: boolean;
  };
}

export interface CreateRelationshipInput {
  type: RelationshipType;
  sourceObjectId: string;
  targetObjectId: string;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
}

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  status: string;
}

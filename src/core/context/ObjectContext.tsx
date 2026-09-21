/**
 * UI99 — Universal Object & Relationship Context
 * Reactive state and operations for the universal connected graph.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BaseObject, CreateObjectInput, UpdateObjectInput, ObjectType, ObjectStatus } from '../types/objects';
import { Relationship, RelationshipType } from '../types/relationships';
import { api } from '../services/apiClient';
import { useAuth } from './AuthContext';

interface ObjectContextType {
  objects: BaseObject[];
  isLoading: boolean;
  error: string | null;
  selectedObject: BaseObject | null;
  setSelectedObject: (obj: BaseObject | null) => void;
  fetchObjects: (filter?: { type?: string; status?: string; tag?: string }) => Promise<void>;
  createObject: (input: CreateObjectInput) => Promise<BaseObject>;
  updateObject: (id: string, updates: UpdateObjectInput) => Promise<BaseObject>;
  deleteObject: (id: string) => Promise<void>;
  linkObjects: (sourceId: string, targetId: string, type: RelationshipType, metadata?: Record<string, any>) => Promise<Relationship>;
  unlinkObjects: (relationshipId: string) => Promise<void>;
  getRelatedObjects: (objectId: string) => { rel: Relationship; object?: BaseObject; isSource: boolean }[];
  inboxCount: number;
}

const ObjectContext = createContext<ObjectContextType | undefined>(undefined);

export function ObjectProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [objects, setObjects] = useState<BaseObject[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<BaseObject | null>(null);

  const fetchObjects = useCallback(async (filter?: { type?: string; status?: string; tag?: string }) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getObjects(filter);
      setObjects(res.objects);
    } catch (err: any) {
      setError(err.message || 'Failed to load objects');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchObjects();
    } else {
      setObjects([]);
      setRelationships([]);
    }
  }, [isAuthenticated, fetchObjects]);

  const createObject = async (input: CreateObjectInput): Promise<BaseObject> => {
    setError(null);
    try {
      const res = await api.createObject(input);
      setObjects((prev) => [res.object, ...prev]);
      return res.object;
    } catch (err: any) {
      setError(err.message || 'Failed to create object');
      throw err;
    }
  };

  const updateObject = async (id: string, updates: UpdateObjectInput): Promise<BaseObject> => {
    setError(null);
    try {
      const res = await api.updateObject(id, updates);
      setObjects((prev) => prev.map((o) => (o.id === id ? res.object : o)));
      if (selectedObject?.id === id) {
        setSelectedObject(res.object);
      }
      return res.object;
    } catch (err: any) {
      setError(err.message || 'Failed to update object');
      throw err;
    }
  };

  const deleteObject = async (id: string): Promise<void> => {
    setError(null);
    try {
      await api.deleteObject(id);
      setObjects((prev) => prev.filter((o) => o.id !== id));
      if (selectedObject?.id === id) {
        setSelectedObject(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete object');
      throw err;
    }
  };

  const linkObjects = async (
    sourceId: string,
    targetId: string,
    type: RelationshipType,
    metadata?: Record<string, any>
  ): Promise<Relationship> => {
    const res = await api.createRelationship({
      sourceObjectId: sourceId,
      targetObjectId: targetId,
      type,
      metadata,
    });
    setRelationships((prev) => [...prev, res.relationship]);
    return res.relationship;
  };

  const unlinkObjects = async (relationshipId: string): Promise<void> => {
    await api.deleteRelationship(relationshipId);
    setRelationships((prev) => prev.filter((r) => r.id !== relationshipId));
  };

  const getRelatedObjects = (objectId: string) => {
    return relationships
      .filter((r) => r.sourceObjectId === objectId || r.targetObjectId === objectId)
      .map((rel) => {
        const isSource = rel.sourceObjectId === objectId;
        const otherId = isSource ? rel.targetObjectId : rel.sourceObjectId;
        const relatedObj = objects.find((o) => o.id === otherId);
        return {
          rel,
          object: relatedObj,
          isSource,
        };
      });
  };

  const inboxCount = objects.filter((o) => o.status === ObjectStatus.INBOX).length;

  return (
    <ObjectContext.Provider
      value={{
        objects,
        isLoading,
        error,
        selectedObject,
        setSelectedObject,
        fetchObjects,
        createObject,
        updateObject,
        deleteObject,
        linkObjects,
        unlinkObjects,
        getRelatedObjects,
        inboxCount,
      }}
    >
      {children}
    </ObjectContext.Provider>
  );
}

export function useObjects(): ObjectContextType {
  const context = useContext(ObjectContext);
  if (!context) {
    throw new Error('useObjects must be used within an ObjectProvider');
  }
  return context;
}

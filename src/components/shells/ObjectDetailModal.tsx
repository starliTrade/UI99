/**
 * UI99 — Object Detail & Relationship Inspector Modal (Build 02.0)
 * Deep inspection and connection graph management for any Universal Object.
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Button';
import { BaseObject, ObjectStatus, ObjectType } from '../../core/types/objects';
import { RelationshipType } from '../../core/types/relationships';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp } from '../../core/context/AppContext';
import {
  Link2,
  Trash2,
  Plus,
  HeartHandshake,
} from 'lucide-react';

export function ObjectDetailModal() {
  const { selectedObject, setSelectedObject, updateObject, deleteObject, linkObjects, unlinkObjects, getRelatedObjects, objects } = useObjects();
  const { addToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ObjectStatus>(ObjectStatus.ACTIVE);
  const [allowSLO, setAllowSLO] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [targetObjectId, setTargetObjectId] = useState('');
  const [linkType, setLinkType] = useState<RelationshipType>(RelationshipType.RELATED_TO);

  useEffect(() => {
    if (selectedObject) {
      setTitle(selectedObject.title);
      setDescription(selectedObject.description || '');
      setStatus(selectedObject.status);
      setAllowSLO(!!selectedObject.permissions?.allowSLOAccess);
      setIsLinking(false);
      setTargetObjectId('');
    }
  }, [selectedObject]);

  if (!selectedObject) return null;

  const related = getRelatedObjects(selectedObject.id);

  const handleSaveUpdates = async () => {
    try {
      await updateObject(selectedObject.id, {
        title,
        description,
        status,
        permissions: {
          ...selectedObject.permissions,
          allowSLOAccess: allowSLO,
        },
      });
      addToast('Object updated', 'success');
      setSelectedObject(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to update', 'warning');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this object from UI99?')) {
      try {
        await deleteObject(selectedObject.id);
        addToast('Object deleted', 'purple');
        setSelectedObject(null);
      } catch (err: any) {
        addToast(err.message || 'Failed to delete', 'warning');
      }
    }
  };

  const handleAddRelationship = async () => {
    if (!targetObjectId) return;
    try {
      await linkObjects(selectedObject.id, targetObjectId, linkType);
      addToast('Connected objects via graph relationship', 'success');
      setIsLinking(false);
      setTargetObjectId('');
    } catch (err: any) {
      addToast(err.message || 'Failed to link', 'warning');
    }
  };

  const availableTargets = objects.filter((o) => o.id !== selectedObject.id);

  return (
    <Modal
      isOpen={!!selectedObject}
      onClose={() => setSelectedObject(null)}
      title={`${selectedObject.type} Details`}
      subtitle={`Created ${new Date(selectedObject.createdAt).toLocaleDateString()}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Title input */}
        <div>
          <label className="block type-caption font-bold text-zinc-400 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#18181D] border border-white/[0.08] rounded-(--radius-field) px-3.5 py-2 type-body text-white font-semibold focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block type-caption font-bold text-zinc-400 mb-1">Description / Notes</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#18181D] border border-white/[0.08] rounded-(--radius-field) p-3 type-body text-zinc-200 focus:outline-none focus:border-white/30 resize-y"
          />
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block type-caption font-bold text-zinc-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ObjectStatus)}
              className="w-full bg-[#18181D] border border-white/[0.08] rounded-(--radius-field) px-3 py-2 type-caption text-white focus:outline-none focus:border-white/30"
            >
              <option value={ObjectStatus.ACTIVE}>Active</option>
              <option value={ObjectStatus.INBOX}>Inbox</option>
              <option value={ObjectStatus.IN_PROGRESS}>In Progress</option>
              <option value={ObjectStatus.COMPLETED}>Completed</option>
              <option value={ObjectStatus.ARCHIVED}>Archived</option>
              <option value={ObjectStatus.PINNED}>Pinned</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block type-caption font-bold text-zinc-400 mb-1">Privacy & SLO</label>
            <button
              type="button"
              onClick={() => setAllowSLO(!allowSLO)}
              className={`w-full py-2 px-3 rounded-(--radius-field) border type-caption font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                allowSLO
                  ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                  : 'bg-[#18181D] text-zinc-400 border-white/[0.08]'
              }`}
            >
              <HeartHandshake className="icon-sm" />
              <span>{allowSLO ? 'SLO Access: Permitted' : 'Private (No Access)'}</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        {selectedObject.tags?.length > 0 && (
          <div>
            <label className="block type-caption font-bold text-zinc-400 mb-1.5">Tags</label>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedObject.tags.map((t) => (
                <Tag key={t} label={t} variant="neutral" />
              ))}
            </div>
          </div>
        )}

        {/* Connected Graph Relationships */}
        <div className="p-4 rounded-(--radius-control) bg-[#18181D] border border-white/[0.08] space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <h4 className="type-caption font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Link2 className="icon-sm text-amber-400" />
              Connected Graph Relations ({related.length})
            </h4>
            {!isLinking && (
              <button
                type="button"
                onClick={() => setIsLinking(true)}
                className="type-caption text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="icon-xs" /> Connect to Object
              </button>
            )}
          </div>

          {/* New Relationship Form */}
          {isLinking && (
            <div className="p-3 bg-[#202026] rounded-(--radius-field) border border-white/[0.08] space-y-2 type-caption">
              <div className="font-semibold text-white">Add Relationship</div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as RelationshipType)}
                  className="bg-[#18181D] border border-white/[0.08] text-white rounded-(--radius-sm) p-1.5"
                >
                  <option value={RelationshipType.RELATED_TO}>RELATED_TO</option>
                  <option value={RelationshipType.PART_OF}>PART_OF</option>
                  <option value={RelationshipType.BELONGS_TO}>BELONGS_TO</option>
                  <option value={RelationshipType.INSPIRED_BY}>INSPIRED_BY</option>
                  <option value={RelationshipType.DEPENDS_ON}>DEPENDS_ON</option>
                  <option value={RelationshipType.ABOUT}>ABOUT</option>
                </select>

                <select
                  value={targetObjectId}
                  onChange={(e) => setTargetObjectId(e.target.value)}
                  className="bg-[#18181D] border border-white/[0.08] text-white rounded-(--radius-sm) p-1.5"
                >
                  <option value="">Select target object...</option>
                  {availableTargets.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.type}] {t.title.slice(0, 30)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLinking(false)}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button size="sm" variant="white-pill" onClick={handleAddRelationship} disabled={!targetObjectId}>
                  Save Link
                </Button>
              </div>
            </div>
          )}

          {/* Linked Objects List */}
          {related.length === 0 ? (
            <p className="type-caption text-zinc-500 italic">
              No relationships connected yet. Link this to projects, notes, or inspirations.
            </p>
          ) : (
            <div className="space-y-1.5">
              {related.map(({ rel, object: relObj }) => (
                <div
                  key={rel.id}
                  className="p-2.5 rounded-(--radius-field) bg-[#202026] border border-white/[0.06] flex items-center justify-between type-caption group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="type-micro font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {rel.type}
                    </span>
                    <span className="font-semibold text-white truncate">
                      {relObj?.title || 'Unknown Object'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => unlinkObjects(rel.id)}
                    className="text-zinc-500 hover:text-rose-400 cursor-pointer type-caption p-1"
                    title="Unlink"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 flex items-center justify-between border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-rose-400 hover:bg-rose-500/10">
            <Trash2 className="icon-md mr-1.5 text-rose-400" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedObject(null)}>
              Cancel
            </Button>
            <Button variant="white-pill" size="sm" onClick={handleSaveUpdates}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

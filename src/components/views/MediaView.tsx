/**
 * UI99 — Media Shell (Build 02.0)
 * Photos, Videos, Music, Books / Reading List, and Movies & Series.
 */

import React from 'react';
import { useObjects } from '../../core/context/ObjectContext';
import { useApp, MediaSubview } from '../../core/context/AppContext';
import { ObjectType } from '../../core/types/objects';
import { SegmentedControl, SegmentOption } from '../ui/SegmentedControl';
import { ObjectCard } from '../ui/ObjectCard';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Toast';
import {
  Image,
  Video,
  Music,
  BookOpen,
  Film,
  Plus,
} from 'lucide-react';

export function MediaView() {
  const { objects, setSelectedObject } = useObjects();
  const { mediaSubview, setMediaSubview, openCapture, themeMode } = useApp();
  const isDark = themeMode === 'dark';

  const subviewOptions: SegmentOption<MediaSubview>[] = [
    { value: 'BOOKS', label: 'Books', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { value: 'MUSIC', label: 'Music & Playlists', icon: <Music className="w-3.5 h-3.5" /> },
    { value: 'MOVIES', label: 'Movies & Series', icon: <Film className="w-3.5 h-3.5" /> },
    { value: 'PHOTOS', label: 'Photos', icon: <Image className="w-3.5 h-3.5" /> },
    { value: 'VIDEOS', label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
  ];

  const getTargetType = (): ObjectType => {
    switch (mediaSubview) {
      case 'BOOKS':
        return ObjectType.BOOK;
      case 'MUSIC':
        return ObjectType.SONG;
      case 'MOVIES':
        return ObjectType.MOVIE;
      case 'PHOTOS':
        return ObjectType.MEMORY;
      case 'VIDEOS':
        return ObjectType.MEMORY;
      default:
        return ObjectType.BOOK;
    }
  };

  const currentType = getTargetType();

  const filteredObjects = objects.filter((o) => {
    if (mediaSubview === 'PHOTOS') {
      return o.type === ObjectType.MEMORY || o.tags?.includes('photo');
    }
    return o.type === currentType;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111116]'}`}>
            Media, Literature & Culture
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8E8E98]' : 'text-[#6E6E78]'}`}>
            Personal books, cinematic inspirations, and musical memories.
          </p>
        </div>

        <Button
          variant={isDark ? 'white-pill' : 'primary'}
          size="sm"
          onClick={() => openCapture(currentType)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add {subviewOptions.find((o) => o.value === mediaSubview)?.label.slice(0, -1) || 'Media'}
        </Button>
      </div>

      {/* Subview Selector */}
      <div className="overflow-x-auto pb-1 no-scrollbar">
        <SegmentedControl
          options={subviewOptions}
          value={mediaSubview}
          onChange={setMediaSubview}
          size="sm"
        />
      </div>

      {/* Object List */}
      {filteredObjects.length === 0 ? (
        <EmptyState
          title={`No ${mediaSubview.toLowerCase()} yet`}
          description="Build your personal sanctuary of timeless art, books, and sound."
          actionLabel={`Add ${mediaSubview}`}
          onAction={() => openCapture(currentType)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredObjects.map((obj) => (
            <ObjectCard
              key={obj.id}
              object={obj}
              onClick={() => setSelectedObject(obj)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

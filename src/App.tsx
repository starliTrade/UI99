/**
 * UI99 — Personal Life OS
 * Root Application Shell (Build 02.0)
 * Obsidian Dark & Crisp Matte Light Theme with iPhone-first ergonomics.
 */

import React from 'react';
import { AuthProvider, useAuth } from './core/context/AuthContext';
import { ObjectProvider } from './core/context/ObjectContext';
import { AppProvider, useApp } from './core/context/AppContext';
import { TopHeader } from './components/ui/TopHeader';
import { BottomNavigation } from './components/ui/BottomNavigation';
import { ToastContainer } from './components/ui/Toast';
import { HomeView } from './components/views/HomeView';
import { LifeView } from './components/views/LifeView';
import { CreateView } from './components/views/CreateView';
import { MediaView } from './components/views/MediaView';
import { MoreView } from './components/views/MoreView';
import { InboxView } from './components/views/InboxView';
import { UIKitView } from './components/views/UIKitView';
import { DocsView } from './components/views/DocsView';
import { FoundationsView } from './components/views/FoundationsView';
import { BlocksView } from './components/views/BlocksView';
import { UniversalCaptureModal } from './components/shells/UniversalCaptureModal';
import { GlobalSearchModal } from './components/shells/GlobalSearchModal';
import { ObjectDetailModal } from './components/shells/ObjectDetailModal';
import { SettingsModal } from './components/shells/SettingsModal';

function MainShell() {
  const { currentTab, themeMode } = useApp();
  const { isRTL } = useAuth();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'HOME':
        return <HomeView />;
      case 'LIFE':
        return <LifeView />;
      case 'CREATE':
        return <CreateView />;
      case 'MEDIA':
        return <MediaView />;
      case 'MORE':
        return <MoreView />;
      case 'INBOX':
        return <InboxView />;
      case 'UIKIT':
        return <UIKitView />;
      case 'DOCS':
        return <DocsView />;
      case 'FOUNDATIONS':
        return <FoundationsView />;
      case 'BLOCKS':
        return <BlocksView />;
      default:
        return <HomeView />;
    }
  };

  const isDark = themeMode === 'dark';

  const content = (
    <div
      className={`min-h-screen ${isDark ? 'dark bg-[#06070A] text-[#EDEDEF] studio-dark-canvas' : 'light bg-[#F4F4F6] text-[#111113]'} flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden ${
        isRTL ? 'font-persian-luxury' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Unified Calm Ambient Canvas Lighting — Soft, neutral, zero color blotches */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isDark ? (
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full bg-white/[0.015] blur-[160px]" />
        ) : (
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-zinc-400/[0.04] blur-3xl" />
        )}
      </div>

      {/* Dedicated Universal Top Header */}
      <TopHeader />

      {/* Main Content Area — Standardized vertical spacing from TopHeader across all views */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-14 md:pt-16 pb-24 sm:pb-28">
        {renderActiveView()}
      </main>

      {/* Floating Glass Navigation Dock */}
      <BottomNavigation />

      {/* Modals, Mobile Sheets & Toasts */}
      <UniversalCaptureModal />
      <GlobalSearchModal />
      <ObjectDetailModal />
      <SettingsModal />
      <ToastContainer />
    </div>
  );

  return content;
}

export function App() {
  return (
    <AuthProvider>
      <ObjectProvider>
        <AppProvider>
          <MainShell />
        </AppProvider>
      </ObjectProvider>
    </AuthProvider>
  );
}

export default App;

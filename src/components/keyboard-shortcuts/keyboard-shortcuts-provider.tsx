'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Command, 
  Search, 
  Plus,
  Home,
  Package,
  Bell,
  Settings,
  BarChart3,
  HelpCircle,
  X,
  Keyboard
} from 'lucide-react';

interface Shortcut {
  key: string;
  modifiers: ('ctrl' | 'meta' | 'shift' | 'alt')[];
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'general';
}

interface KeyboardShortcutsContextType {
  shortcuts: Shortcut[];
  showShortcutsModal: boolean;
  setShowShortcutsModal: (show: boolean) => void;
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  onAddProduct?: () => void;
  onSearch?: () => void;
}

export function KeyboardShortcutsProvider({ 
  children, 
  onAddProduct,
  onSearch 
}: KeyboardShortcutsProviderProps) {
  const router = useRouter();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const shortcuts: Shortcut[] = [
    // Navigation
    { key: 'g', modifiers: [], description: 'Go to Dashboard', action: () => router.push('/dashboard'), category: 'navigation' },
    { key: 'p', modifiers: [], description: 'Go to Products', action: () => router.push('/products'), category: 'navigation' },
    { key: 'a', modifiers: [], description: 'Go to Alerts', action: () => router.push('/alerts'), category: 'navigation' },
    { key: 's', modifiers: [], description: 'Go to Settings', action: () => router.push('/settings'), category: 'navigation' },
    { key: 'y', modifiers: [], description: 'Go to Analytics', action: () => router.push('/analytics'), category: 'navigation' },
    { key: 'h', modifiers: [], description: 'Go to Help', action: () => router.push('/help'), category: 'navigation' },
    
    // Actions
    { key: 'n', modifiers: [], description: 'Add new product', action: () => onAddProduct?.(), category: 'actions' },
    { key: 'k', modifiers: ['meta'], description: 'Open command palette', action: () => setShowCommandPalette(true), category: 'actions' },
    { key: '/', modifiers: [], description: 'Focus search', action: () => onSearch?.(), category: 'actions' },
    
    // General
    { key: '?', modifiers: ['shift'], description: 'Show keyboard shortcuts', action: () => setShowShortcutsModal(true), category: 'general' },
    { key: 'Escape', modifiers: [], description: 'Close modal/palette', action: () => { setShowShortcutsModal(false); setShowCommandPalette(false); }, category: 'general' },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // But allow Escape and Cmd+K
      if (event.key !== 'Escape' && !(event.key === 'k' && (event.metaKey || event.ctrlKey))) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      const modifiersMatch = 
        shortcut.modifiers.includes('ctrl') === event.ctrlKey &&
        shortcut.modifiers.includes('meta') === event.metaKey &&
        shortcut.modifiers.includes('shift') === event.shiftKey &&
        shortcut.modifiers.includes('alt') === event.altKey;

      // Handle ? which requires shift
      const keyMatch = shortcut.key === '?' 
        ? event.key === '?' || (event.key === '/' && event.shiftKey)
        : event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (keyMatch && modifiersMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        shortcuts,
        showShortcutsModal,
        setShowShortcutsModal,
        showCommandPalette,
        setShowCommandPalette,
      }}
    >
      {children}
      {showShortcutsModal && <ShortcutsModal shortcuts={shortcuts} onClose={() => setShowShortcutsModal(false)} />}
      {showCommandPalette && <CommandPalette onClose={() => setShowCommandPalette(false)} />}
    </KeyboardShortcutsContext.Provider>
  );
}

function ShortcutsModal({ shortcuts, onClose }: { shortcuts: Shortcut[]; onClose: () => void }) {
  const navigationShortcuts = shortcuts.filter(s => s.category === 'navigation');
  const actionShortcuts = shortcuts.filter(s => s.category === 'actions');
  const generalShortcuts = shortcuts.filter(s => s.category === 'general');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          <ShortcutSection title="Navigation" shortcuts={navigationShortcuts} />
          <ShortcutSection title="Actions" shortcuts={actionShortcuts} />
          <ShortcutSection title="General" shortcuts={generalShortcuts} />
        </div>
      </div>
    </div>
  );
}

function ShortcutSection({ title, shortcuts }: { title: string; shortcuts: Shortcut[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-400 mb-3">{title}</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <span className="text-zinc-300">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-400 font-mono">
              {shortcut.modifiers.map(m => m === 'meta' ? '⌘' : m === 'ctrl' ? 'Ctrl' : m === 'shift' ? '⇧' : 'Alt').join(' + ')}
              {shortcut.modifiers.length > 0 && ' + '}
              {shortcut.key.toUpperCase()}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const commands = [
    { icon: Home, label: 'Go to Dashboard', action: () => { router.push('/dashboard'); onClose(); } },
    { icon: Package, label: 'Go to Products', action: () => { router.push('/products'); onClose(); } },
    { icon: Bell, label: 'Go to Alerts', action: () => { router.push('/alerts'); onClose(); } },
    { icon: BarChart3, label: 'Go to Analytics', action: () => { router.push('/analytics'); onClose(); } },
    { icon: Settings, label: 'Go to Settings', action: () => { router.push('/settings'); onClose(); } },
    { icon: HelpCircle, label: 'Go to Help', action: () => { router.push('/help'); onClose(); } },
    { icon: Plus, label: 'Add new product', action: () => { router.push('/products?add=true'); onClose(); } },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 py-4 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <div className="p-2">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={cmd.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-zinc-800 transition-colors"
                >
                  <cmd.icon className="w-5 h-5 text-zinc-500" />
                  <span className="text-zinc-300">{cmd.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500">
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppCtx = createContext(null);

/**
 * Ticket stub item structure:
 * {
 *   id: string,
 *   image: dataUrl,
 *   name: string,
 *   date: string (YYYY-MM-DD),
 *   location: string,
 *   type: string (concert/movie/sports/festival/other),
 *   notes: string
 * }
 */
export function AppProvider({ children }) {
  const [stubs, setStubs] = useLocalStorage('stubs', []);
  const [filters, setFilters] = useLocalStorage('filters', { q: '', year: 'all', type: 'all' });
  const [view, setView] = useLocalStorage('view', 'grid');

  const addStub = (stub) => {
    setStubs(prev => [{...stub, id: crypto.randomUUID?.() || String(Date.now())}, ...prev]);
  };
  const updateStub = (id, patch) => {
    setStubs(prev => prev.map(s => s.id === id ? {...s, ...patch} : s));
  };
  const removeStub = (id) => {
    setStubs(prev => prev.filter(s => s.id !== id));
  };

  const filtered = useMemo(() => {
    return stubs.filter(s => {
      const matchQ = filters.q
        ? (s.name?.toLowerCase().includes(filters.q.toLowerCase()) ||
           s.location?.toLowerCase().includes(filters.q.toLowerCase()))
        : true;
      const matchYear = filters.year === 'all' ? true : (s.date ? new Date(s.date).getFullYear() === Number(filters.year) : false);
      const matchType = filters.type === 'all' ? true : s.type === filters.type;
      return matchQ && matchYear && matchType;
    });
  }, [stubs, filters]);

  const value = {
    stubs,
    setStubs,
    addStub,
    updateStub,
    removeStub,
    filters,
    setFilters,
    view,
    setView,
    filtered
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useApp() {
  /** Access application state and CRUD for ticket stubs. */
  return useContext(AppCtx);
}

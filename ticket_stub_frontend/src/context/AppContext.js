import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppCtx = createContext(null);

/**
 * Ticket stub item structure:
 * {
 *   id: string,
 *   image: url or dataUrl,
 *   name: string,
 *   date: string (YYYY-MM-DD),
 *   location: string,
 *   type: string (concert/movie/sports/festival/other),
 *   notes: string
 * }
 */

// Demo data: visually diverse set seeded on first load if storage is empty.
const DEMO_STUBS = [
  {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    name: 'The Midnight – Endless Summer Tour',
    date: '2019-08-17',
    location: 'Austin, TX · ACL Live',
    type: 'concert',
    notes: 'My first synthwave concert! The crowd sang along to Sunset – unforgettable.'
  },
  {
    image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200&auto=format&fit=crop',
    name: 'Championship Game: Longhorns vs Sooners',
    date: '2018-10-06',
    location: 'Dallas, TX · Cotton Bowl',
    type: 'sports',
    notes: 'Went with college friends. We painted our faces and lost our voices by halftime.'
  },
  {
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop',
    name: 'Inception (10th Anniversary Re-release)',
    date: '2020-09-05',
    location: 'San Francisco, CA · Alamo Drafthouse',
    type: 'movie',
    notes: 'Won free tickets from a trivia night! Still debated the ending on the ride home.'
  },
  {
    image: 'https://images.unsplash.com/photo-1514525253125-211f0b5b8a43?q=80&w=1200&auto=format&fit=crop',
    name: 'Coastal Lights Festival',
    date: '2021-06-12',
    location: 'Santa Monica, CA · Beachfront Park',
    type: 'festival',
    notes: 'Food trucks, fairy lights, and an ocean breeze. Danced barefoot in the sand.'
  },
  {
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop',
    name: 'John Williams: A Night at the Movies',
    date: '2017-03-25',
    location: 'Boston, MA · Symphony Hall',
    type: 'concert',
    notes: 'Hedwig’s Theme live gave me goosebumps. Surprise encore: Star Wars main title!'
  },
  {
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    name: 'Indie Film Premiere – “Parallel Streets”',
    date: '2022-11-19',
    location: 'Portland, OR · Cinema 21',
    type: 'movie',
    notes: 'Q&A with the director after the screening. Took a photo with the cast in the lobby.'
  },
  {
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
    name: 'River Run Half Marathon',
    date: '2016-04-10',
    location: 'Nashville, TN · Downtown',
    type: 'other',
    notes: 'Not a spectator ticket—my bib! Beat my personal record and treated myself to pancakes.'
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
    name: 'Summer Jam Park Concert',
    date: '2023-07-22',
    location: 'Seattle, WA · Gas Works Park',
    type: 'concert',
    notes: 'Sunset, skyline, and surprise guest DJ. Brought a picnic blanket and glowed all night.'
  }
];

function withIds(arr) {
  return arr.map(item => ({
    ...item,
    id: crypto.randomUUID?.() || String(Date.now() + Math.random())
  }));
}

export function AppProvider({ children }) {
  const [stubs, setStubs] = useLocalStorage('stubs', []);
  const [filters, setFilters] = useLocalStorage('filters', { q: '', year: 'all', type: 'all' });
  const [view, setView] = useLocalStorage('view', 'grid');

  // Seed demo data only when storage has no stubs
  React.useEffect(() => {
    if (!Array.isArray(stubs) || stubs.length === 0) {
      // Avoid overwriting existing user data
      setStubs(prev => {
        if (Array.isArray(prev) && prev.length > 0) return prev;
        return withIds(DEMO_STUBS);
      });
    }
    // We intentionally want this to run once on mount; eslint disabled for exhaustive-deps here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

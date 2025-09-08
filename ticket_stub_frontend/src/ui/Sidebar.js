import React from 'react';
import { useApp } from '../context/AppContext';

const TYPES = ['concert','movie','sports','festival','other'];

/**
 * Search and filter sidebar.
 */
export default function Sidebar() {
  const { filters, setFilters, stubs } = useApp();

  const years = React.useMemo(() => {
    const ys = new Set();
    stubs.forEach(s => { if (s.date) ys.add(new Date(s.date).getFullYear()); });
    return Array.from(ys).sort((a,b)=>b-a);
  }, [stubs]);

  const set = (patch) => setFilters(prev => ({...prev, ...patch}));

  return (
    <aside className="sidebar">
      <h3>Search</h3>
      <div className="field">
        <input
          className="input"
          placeholder="Search by name or location"
          value={filters.q || ''}
          onChange={e=>set({ q: e.target.value })}
        />
      </div>
      <div className="divider" />
      <h3>Filters</h3>
      <div className="filter-group">
        <div className="field">
          <label>Year</label>
          <select className="select" value={filters.year || 'all'} onChange={e=>set({year: e.target.value})}>
            <option value="all">All years</option>
            {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Type</label>
          <select className="select" value={filters.type || 'all'} onChange={e=>set({type: e.target.value})}>
            <option value="all">All types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button className="btn ghost" onClick={()=>setFilters({ q: '', year: 'all', type: 'all' })}>Reset</button>
      </div>
      <div className="divider" />
      <p className="helper">Tip: Use the Upload button to add new tickets. Click any card to view details and add notes.</p>
    </aside>
  );
}

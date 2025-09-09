import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Simple avatar generator (emoji-based) for cute vibe
const avatarEmojis = ['🐰', '🐱', '🐻', '🦊', '🐼', '🦄', '🐨', '🐧', '🦓', '🐥'];
const getAvatar = (seed = 0) => avatarEmojis[seed % avatarEmojis.length];

// PUBLIC_INTERFACE
function App() {
  /**
   * Cute scrapbook UI for ticket stub organizer.
   * Includes: Navbar, Upload modal, Filter sidebar, Grid/Scrapbook views, Ticket details drawer.
   */
  const [theme] = useState('light'); // fixed to light for now (cute pastel vibe)
  const [view, setView] = useState('grid'); // 'grid' | 'scrapbook'
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ year: 'all', type: 'all' });
  const [showUpload, setShowUpload] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);

  // Apply theme to html attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Seed demo data if none
  useEffect(() => {
    if (tickets.length === 0) {
      setTickets([
        {
          id: 't1',
          image: '',
          eventName: 'Starglow Festival',
          date: '2023-08-12',
          location: 'Riverside Park',
          type: 'Festival',
          notes: 'Glitter confetti and cotton candy skies!',
        },
        {
          id: 't2',
          image: '',
          eventName: 'Midnight Cinema',
          date: '2022-10-31',
          location: 'Aurora Theater',
          type: 'Movie',
          notes: 'Spooky marathon. Popcorn for days.',
        },
        {
          id: 't3',
          image: '',
          eventName: 'Thunder Cup Finals',
          date: '2021-06-02',
          location: 'Comet Arena',
          type: 'Sports',
          notes: 'Overtime win! Lost my voice cheering.',
        },
      ]);
    }
  }, [tickets.length]);

  const years = useMemo(() => {
    const ys = new Set(tickets.map(t => new Date(t.date).getFullYear().toString()));
    return ['all', ...Array.from(ys).sort((a, b) => Number(b) - Number(a))];
  }, [tickets]);

  const types = useMemo(() => {
    const ts = new Set(tickets.map(t => t.type));
    return ['all', ...Array.from(ts)];
  }, [tickets]);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const bySearch =
        t.eventName.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase());
      const byYear =
        filters.year === 'all' ||
        new Date(t.date).getFullYear().toString() === filters.year;
      const byType = filters.type === 'all' || t.type === filters.type;
      return bySearch && byYear && byType;
    });
  }, [tickets, search, filters]);

  // PUBLIC_INTERFACE
  const handleUpload = (ticket) => {
    /**
     * Adds a newly uploaded/created ticket to the collection.
     */
    setTickets(prev => [{ ...ticket, id: `t${Date.now()}` }, ...prev]);
    setShowUpload(false);
  };

  // PUBLIC_INTERFACE
  const handleUpdate = (id, updates) => {
    /**
     * Updates an existing ticket.
     */
    setTickets(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    setSelected(s => (s && s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <div className="CuteApp">
      <NavBar onUpload={() => setShowUpload(true)} currentView={view} setView={setView} />

      <div className="CuteLayout">
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          years={years}
          types={types}
        />

        <main className="CuteMain">
          {view === 'grid' ? (
            <GridView tickets={filtered} onSelect={setSelected} />
          ) : (
            <ScrapbookView tickets={filtered} onSelect={setSelected} />
          )}
        </main>
      </div>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onSave={handleUpload} />
      )}

      {selected && (
        <DetailsDrawer
          ticket={selected}
          onClose={() => setSelected(null)}
          onSave={(updates) => handleUpdate(selected.id, updates)}
        />
      )}

      <Footer />
    </div>
  );
}

function NavBar({ onUpload, currentView, setView }) {
  return (
    <nav className="CuteNav">
      <div className="nav-left">
        <span className="logo-sticker">🎟️</span>
        <div className="brand">
          <div className="brand-title">Stub Scrapbook</div>
          <div className="brand-subtitle">Little memories, big smiles</div>
        </div>
      </div>

      <div className="nav-right">
        <div className="view-toggle">
          <button
            className={`chip ${currentView === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
            aria-label="Switch to grid view"
          >
            ⬛ Grid
          </button>
          <button
            className={`chip ${currentView === 'scrapbook' ? 'active' : ''}`}
            onClick={() => setView('scrapbook')}
            aria-label="Switch to scrapbook view"
          >
            📒 Scrapbook
          </button>
        </div>
        <button className="btn-accent" onClick={onUpload} aria-label="Upload a new ticket">
          ✨ Upload
        </button>
        <UserBadge username="Poppy" seed={3} />
      </div>
    </nav>
  );
}

function UserBadge({ username, seed }) {
  const avatar = getAvatar(seed);
  return (
    <div className="user-badge" title="Signed in">
      <div className="avatar">{avatar}</div>
      <div className="user-meta">
        <span className="user-name">{username}</span>
        <span className="user-tag">Online</span>
      </div>
      <span className="badge-tape">washi</span>
    </div>
  );
}

function FilterSidebar({ search, setSearch, filters, setFilters, years, types }) {
  return (
    <aside className="CuteSidebar">
      <div className="sidebar-card">
        <h3 className="card-title">Search</h3>
        <div className="input-wrap">
          <span className="input-deco">🔎</span>
          <input
            className="input"
            placeholder="Find a memory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="input-tape" />
        </div>
      </div>

      <div className="sidebar-card">
        <h3 className="card-title">Filters</h3>
        <label className="label">Year</label>
        <div className="pill-row">
          {years.map(y => (
            <button
              key={y}
              className={`pill ${filters.year === y ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, year: y }))}
            >
              {y === 'all' ? 'All' : y}
            </button>
          ))}
        </div>

        <label className="label">Type</label>
        <div className="pill-row">
          {types.map(t => (
            <button
              key={t}
              className={`pill ${filters.type === t ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, type: t }))}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-sticker">🌈</div>
      <div className="sidebar-sticker s2">💌</div>
    </aside>
  );
}

function GridView({ tickets, onSelect }) {
  return (
    <section className="GridView">
      {tickets.map((t, idx) => (
        <div key={t.id} className="ticket-card" onClick={() => onSelect(t)} role="button" tabIndex={0}>
          <div className={`ticket-img ${t.image ? '' : 'placeholder'}`}>
            {t.image ? <img src={t.image} alt={t.eventName} /> : <span>📷</span>}
          </div>
          <div className="ticket-body">
            <div className="ticket-title">{t.eventName}</div>
            <div className="ticket-meta">
              <span>📍 {t.location}</span>
              <span>🗓️ {new Date(t.date).toLocaleDateString()}</span>
            </div>
            <div className="ticket-tags">
              <span className="tag">{t.type}</span>
            </div>
          </div>
          <div className={`ticket-tape tape-${(idx % 3) + 1}`} />
        </div>
      ))}
      {tickets.length === 0 && (
        <div className="empty">
          <div className="empty-emoji">🫧</div>
          <div className="empty-text">No stubs yet — add your first memory!</div>
        </div>
      )}
    </section>
  );
}

function ScrapbookView({ tickets, onSelect }) {
  return (
    <section className="ScrapbookView">
      {tickets.map((t, idx) => (
        <div key={t.id} className={`scrap-note tilt-${(idx % 5) + 1}`} onClick={() => onSelect(t)}>
          <div className="note-pin">📎</div>
          <div className={`note-photo ${t.image ? '' : 'placeholder'}`}>
            {t.image ? <img src={t.image} alt={t.eventName} /> : <span>🎞️</span>}
          </div>
          <div className="note-caption">
            <div className="note-title">{t.eventName}</div>
            <div className="note-sub">🗓️ {new Date(t.date).toLocaleDateString()}</div>
            <div className="note-sub">📍 {t.location}</div>
          </div>
          <div className="note-washi">washi</div>
        </div>
      ))}
      {tickets.length === 0 && (
        <div className="empty">
          <div className="empty-emoji">🌸</div>
          <div className="empty-text">Your scrapbook is waiting for sparkles.</div>
        </div>
      )}
    </section>
  );
}

function UploadModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    image: '',
    eventName: '',
    date: '',
    location: '',
    type: 'Concert',
    notes: '',
  });

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.eventName || !form.date) return;
    onSave(form);
  };

  return (
    <div className="ModalOverlay" role="dialog" aria-modal="true">
      <div className="CuteModal">
        <div className="modal-head">
          <div className="modal-title">New Memory ✨</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✖️</button>
        </div>
        <form onSubmit={submit} className="modal-body">
          <div className="uploader">
            <label className="upload-card">
              <input type="file" accept="image/*" onChange={onFile} hidden />
              {form.image ? (
                <img src={form.image} alt="preview" />
              ) : (
                <div className="upload-placeholder">
                  <div className="up-emoji">📸</div>
                  <div className="up-text">Add a photo of the stub</div>
                </div>
              )}
              <span className="upload-tape">washi</span>
            </label>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="label">Event name</label>
              <input
                className="input"
                value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                placeholder="e.g., Moonlight Concert"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Location</label>
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., Blossom Hall"
              />
            </div>
            <div className="form-group">
              <label className="label">Type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Concert</option>
                <option>Movie</option>
                <option>Sports</option>
                <option>Festival</option>
                <option>Theater</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group form-span">
              <label className="label">Notes</label>
              <textarea
                className="input"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Write a cute memory..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Memory</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailsDrawer({ ticket, onClose, onSave }) {
  const [edit, setEdit] = useState(ticket);

  useEffect(() => setEdit(ticket), [ticket]);

  const submit = (e) => {
    e.preventDefault();
    onSave(edit);
  };

  return (
    <div className="DrawerOverlay" onClick={onClose}>
      <aside className="CuteDrawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div className="drawer-title">Memory Details 💖</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✖️</button>
        </div>
        <div className="drawer-photo">
          <div className={`drawer-img ${edit.image ? '' : 'placeholder'}`}>
            {edit.image ? <img src={edit.image} alt={edit.eventName} /> : <span>🖼️</span>}
          </div>
          <span className="drawer-washi">washi</span>
        </div>
        <form onSubmit={submit} className="drawer-form">
          <div className="form-group">
            <label className="label">Event name</label>
            <input
              className="input"
              value={edit.eventName}
              onChange={(e) => setEdit({ ...edit, eventName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="label">Date</label>
            <input
              className="input"
              type="date"
              value={edit.date}
              onChange={(e) => setEdit({ ...edit, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="label">Location</label>
            <input
              className="input"
              value={edit.location}
              onChange={(e) => setEdit({ ...edit, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="label">Type</label>
            <select
              className="input"
              value={edit.type}
              onChange={(e) => setEdit({ ...edit, type: e.target.value })}
            >
              <option>Concert</option>
              <option>Movie</option>
              <option>Sports</option>
              <option>Festival</option>
              <option>Theater</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={4}
              value={edit.notes}
              onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
            />
          </div>

          <div className="drawer-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Close</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function Footer() {
  return (
    <footer className="CuteFooter">
      <div className="footer-content">
        <span className="footer-note">Made with ☁️ candy clouds and ✨ sparkle dust</span>
        <span className="footer-doodle">✿</span>
      </div>
    </footer>
  );
}

export default App;

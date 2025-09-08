import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

/**
 * Top navigation bar with branding and primary actions
 */
export default function Navbar({ onOpenUpload }) {
  const { user, logout } = useAuth();
  const { view, setView } = useApp();

  const go = (hash) => () => { window.location.hash = hash; };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="brand" onClick={go('#/grid')} style={{cursor:'pointer'}}>
          <div className="brand-badge">🎟️</div>
          Ticket Scrapbook
        </div>

        <div className="nav-actions">
          {user && (
            <>
              <button className={`btn secondary`} onClick={()=>setView(view === 'grid' ? 'scrapbook' : 'grid')}>
                {view === 'grid' ? 'Scrapbook view' : 'Grid view'}
              </button>
              <button className="btn accent" onClick={onOpenUpload}>Upload</button>
              <button className="btn ghost" onClick={go('#/grid')}>Home</button>
              <button className="btn ghost" onClick={go('#/scrapbook')}>Scrapbook</button>
            </>
          )}
          {user ? (
            <button className="btn" onClick={logout}>Sign out</button>
          ) : (
            <button className="btn" onClick={go('#/login')}>Sign in</button>
          )}
        </div>
      </div>
    </nav>
  );
}

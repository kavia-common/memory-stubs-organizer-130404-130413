import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../ui/Navbar';
import Sidebar from '../ui/Sidebar';
import UploadModal from '../ui/UploadModal';
import GridView from '../views/GridView';
import ScrapbookView from '../views/ScrapbookView';
import DetailView from '../views/DetailView';

/**
 * Lightweight internal router using hash for SPA without react-router-dom.
 * Paths:
 * - #/login
 * - #/grid
 * - #/scrapbook
 * - #/detail/:id
 */
export default function Router() {
  const { user } = useAuth();
  const [path, setPath] = React.useState(window.location.hash || '#/grid');
  const [showUpload, setShowUpload] = React.useState(false);

  React.useEffect(() => {
    const onHash = () => setPath(window.location.hash || '#/grid');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const route = path.replace(/^#/, '');

  if (!user && route !== '/login') {
    window.location.hash = '#/login';
  }

  return (
    <div className="app-shell">
      <Navbar onOpenUpload={() => setShowUpload(true)} />
      <div className="app-content container">
        {user && <Sidebar />}
        <main className="page">
          {!user && route === '/login' && <AuthGate />}
          {user && (route === '/grid' || route === '/') && <GridView onOpenUpload={() => setShowUpload(true)} />}
          {user && route === '/scrapbook' && <ScrapbookView onOpenUpload={() => setShowUpload(true)} />}
          {user && route.startsWith('/detail/') && <DetailView id={route.split('/').pop()} />}
        </main>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}

function AuthGate() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

  return (
    <div style={{maxWidth: 420, margin: '40px auto'}}>
      <div className="scrap" style={{padding: 18}}>
        <h2 style={{marginTop: 8}}>Welcome to Ticket Scrapbook</h2>
        <p className="helper">Sign in to save and organize your ticket stubs.</p>
        <div className="divider" />
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} />
        </div>
        <div style={{display:'flex', gap:8, marginTop:6}}>
          <button className="btn" onClick={()=>login(email || 'demo@user.dev')}>Sign in</button>
          <button className="btn ghost" onClick={()=>login('guest@demo.dev')}>Continue as guest</button>
        </div>
        <p className="helper" style={{marginTop:8}}>No backend configured yet; this demo stores data locally in your browser.</p>
      </div>
    </div>
  );
}

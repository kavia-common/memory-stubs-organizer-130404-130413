import React from 'react';
import { useApp } from '../context/AppContext';

/**
 * Displays and edits a single ticket stub.
 */
export default function DetailView({ id }) {
  const { stubs, updateStub, removeStub } = useApp();
  const item = stubs.find(s => s.id === id);

  const [edit, setEdit] = React.useState(null);

  React.useEffect(() => {
    if (item) {
      setEdit({
        name: item.name || '',
        date: item.date || '',
        location: item.location || '',
        type: item.type || 'other',
        notes: item.notes || ''
      });
    }
  }, [item]);

  if (!item) {
    return (
      <div className="scrap" style={{padding:16}}>
        <h2>Not found</h2>
        <p className="helper">This ticket might have been removed.</p>
        <button className="btn" onClick={()=>window.location.hash = '#/grid'}>Back to list</button>
      </div>
    );
  }

  const save = () => {
    updateStub(item.id, edit);
  };

  const del = () => {
    if (window.confirm('Delete this ticket?')) {
      removeStub(item.id);
      window.location.hash = '#/grid';
    }
  };

  return (
    <div className="detail">
      <section className="detail-media">
        <img className="detail-img" alt={item.name} src={item.image} />
        <div style={{display:'flex', gap:8, marginTop:10}}>
          <button className="btn ghost" onClick={()=>window.location.hash = '#/grid'}>Back</button>
          <button className="btn" onClick={save}>Save changes</button>
          <button className="btn accent" onClick={del}>Delete</button>
        </div>
      </section>

      <section className="detail-panel">
        <h3>Details</h3>
        <div className="divider" />
        <div className="field">
          <label>Event Name</label>
          <input className="input" value={edit?.name || ''} onChange={e=>setEdit(v=>({...v, name: e.target.value}))}/>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Date</label>
            <input className="input" type="date" value={edit?.date || ''} onChange={e=>setEdit(v=>({...v, date: e.target.value}))}/>
          </div>
          <div className="field">
            <label>Location</label>
            <input className="input" value={edit?.location || ''} onChange={e=>setEdit(v=>({...v, location: e.target.value}))}/>
          </div>
        </div>
        <div className="field">
          <label>Type</label>
          <select className="select" value={edit?.type || 'other'} onChange={e=>setEdit(v=>({...v, type: e.target.value}))}>
            <option value="concert">concert</option>
            <option value="movie">movie</option>
            <option value="sports">sports</option>
            <option value="festival">festival</option>
            <option value="other">other</option>
          </select>
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea className="textarea" rows={6} value={edit?.notes || ''} onChange={e=>setEdit(v=>({...v, notes: e.target.value}))} />
        </div>

        <div className="divider" />
        <h4>Quick info</h4>
        <div className="kv">
          <div className="helper">When</div>
          <div>{(edit?.date && new Date(edit.date).toLocaleDateString()) || 'Unknown'}</div>
          <div className="helper">Where</div>
          <div>{edit?.location || 'Unknown'}</div>
          <div className="helper">Type</div>
          <div><span className="badge">{edit?.type}</span></div>
        </div>
      </section>
    </div>
  );
}

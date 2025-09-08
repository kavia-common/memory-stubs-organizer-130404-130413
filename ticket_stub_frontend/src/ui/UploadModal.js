import React from 'react';
import { useApp } from '../context/AppContext';

const TYPES = ['concert','movie','sports','festival','other'];

/**
 * Modal for uploading a new ticket stub with details.
 */
export default function UploadModal({ onClose }) {
  const { addStub } = useApp();
  const [img, setImg] = React.useState(null);
  const [form, setForm] = React.useState({
    name: '',
    date: '',
    location: '',
    type: 'concert',
    notes: ''
  });

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImg(reader.result);
    reader.readAsDataURL(file);
  };

  const set = (patch) => setForm(prev => ({...prev, ...patch}));

  const submit = () => {
    if (!img || !form.name) return;
    addStub({ image: img, ...form });
    onClose?.();
  };

  return (
    <div className="modal-backdrop" onClick={(e)=>{ if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Upload Ticket">
        <div className="modal-header">
          <h3>Add a Ticket</h3>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
        <div className="field">
          <label>Ticket Image</label>
          <input type="file" accept="image/*" onChange={onFile} />
          <p className="helper">Upload a photo or scan of your ticket.</p>
        </div>
        {img && <img alt="preview" src={img} style={{width:'100%', borderRadius:12, margin:'8px 0'}} />}
        <div className="form-row">
          <div className="field">
            <label>Event Name</label>
            <input className="input" value={form.name} onChange={e=>set({name: e.target.value})} placeholder="The Midnight - Tour" />
          </div>
          <div className="field">
            <label>Date</label>
            <input className="input" type="date" value={form.date} onChange={e=>set({date: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Location</label>
            <input className="input" value={form.location} onChange={e=>set({location: e.target.value})} placeholder="Austin, TX" />
          </div>
          <div className="field">
            <label>Type</label>
            <select className="select" value={form.type} onChange={e=>set({type: e.target.value})}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea className="textarea" rows={3} placeholder="Favorite song was..." value={form.notes} onChange={e=>set({notes: e.target.value})}/>
        </div>

        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn accent" onClick={submit} disabled={!img || !form.name}>Save ticket</button>
        </div>
      </div>
    </div>
  );
}

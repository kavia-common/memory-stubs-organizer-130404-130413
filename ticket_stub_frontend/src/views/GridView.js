import React from 'react';
import { useApp } from '../context/AppContext';

/**
 * Displays tickets in a clean grid of cards.
 */
export default function GridView({ onOpenUpload }) {
  const { filtered } = useApp();

  const open = (id) => () => { window.location.hash = `#/detail/${id}`; };

  if (!filtered.length) {
    return (
      <div className="scrap" style={{padding:16}}>
        <h2>No tickets yet</h2>
        <p className="helper">Upload your first ticket to start your scrapbook!</p>
        <button className="btn accent" onClick={onOpenUpload}>Upload a ticket</button>
      </div>
    );
  }

  return (
    <div className="grid">
      {filtered.map(item => (
        <div className="card" key={item.id} onClick={open(item.id)}>
          <div className="tape" />
          <img className="card-img" alt={item.name} src={item.image} />
          <div className="card-body">
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <strong>{item.name || 'Untitled event'}</strong>
              {item.type && <span className="badge">{item.type}</span>}
            </div>
            <div className="helper" style={{marginTop:6}}>
              {(item.date && new Date(item.date).toLocaleDateString()) || 'No date'} • {item.location || 'Unknown location'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

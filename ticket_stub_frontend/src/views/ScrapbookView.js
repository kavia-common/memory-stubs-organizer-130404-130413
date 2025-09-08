import React from 'react';
import { useApp } from '../context/AppContext';

/**
 * Displays tickets in a scrapbook-like layout with tape and dashed borders.
 */
export default function ScrapbookView({ onOpenUpload }) {
  const { filtered } = useApp();

  if (!filtered.length) {
    return (
      <div className="scrap" style={{padding:16}}>
        <h2>Your scrapbook is empty</h2>
        <p className="helper">Add some tickets to fill the page with memories.</p>
        <button className="btn accent" onClick={onOpenUpload}>Upload a ticket</button>
      </div>
    );
  }

  return (
    <div className="scrapbook">
      {filtered.map(item => (
        <div className="scrap" key={item.id} onClick={()=>window.location.hash = `#/detail/${item.id}`} style={{cursor:'pointer'}}>
          <img className="scrap-img" alt={item.name} src={item.image} />
          <div className="scrap-caption">
            <strong>{item.name || 'Untitled'}</strong><br />
            {(item.date && new Date(item.date).toLocaleDateString()) || 'No date'} • {item.location || 'Unknown'}
          </div>
        </div>
      ))}
    </div>
  );
}

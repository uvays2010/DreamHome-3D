import React from 'react';

function FurnitureLibrary({ catalog, onAdd }) {
  return (
    <div className="furniture-library">
      <h3>Mebel Kutubxonasi</h3>
      <div className="library-grid">
        {catalog.map(item => (
          <button key={item.id} className="library-item" onClick={() => onAdd(item.type)}>
            <div className="item-preview" style={{ backgroundColor: item.color }}></div>
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FurnitureLibrary;

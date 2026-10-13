import React from 'react';

function PropertiesPanel({ object, onUpdate, onDelete }) {
  if (!object) {
    return (
      <div className="properties-panel">
        <h3>Xususiyatlar</h3>
        <p>Ob'ektni tanlang</p>
      </div>
    );
  }

  const handleColorChange = (e) => {
    onUpdate({ color: e.target.value });
  };

  return (
    <div className="properties-panel">
      <h3>Xususiyatlar</h3>
      <div className="prop">
        <label>Tur:</label>
        <span>{object.type}</span>
      </div>
      <div className="prop">
        <label>Rang:</label>
        <input type="color" value={object.color} onChange={handleColorChange} />
      </div>
      <div className="prop">
        <label>Pozitsiya X:</label>
        <input 
          type="number" 
          step="0.1" 
          value={object.position[0].toFixed(2)} 
          onChange={(e) => onUpdate({ position: [parseFloat(e.target.value), object.position[1], object.position[2]] })} 
        />
      </div>
      <div className="prop">
        <label>Pozitsiya Y:</label>
        <input 
          type="number" 
          step="0.1" 
          value={object.position[1].toFixed(2)} 
          onChange={(e) => onUpdate({ position: [object.position[0], parseFloat(e.target.value), object.position[2]] })} 
        />
      </div>
      <div className="prop">
        <label>Pozitsiya Z:</label>
        <input 
          type="number" 
          step="0.1" 
          value={object.position[2].toFixed(2)} 
          onChange={(e) => onUpdate({ position: [object.position[0], object.position[1], parseFloat(e.target.value)] })} 
        />
      </div>
      <button className="delete-btn" onClick={onDelete}>O'chirish</button>
    </div>
  );
}

export default PropertiesPanel;

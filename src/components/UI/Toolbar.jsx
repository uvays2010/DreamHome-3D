import React from 'react';

function Toolbar({ mode, setMode, wireframe, setWireframe, showGrid, setShowGrid, onSave, onLoad, rooms, currentRoomId, setCurrentRoomId, onAddRoom }) {
  return (
    <div className="toolbar">
      <div className="logo">DreamHome 3D</div>
      <div className="tools">
        <button className={mode === 'translate' ? 'active' : ''} onClick={() => setMode('translate')} title="Ko'chirish">↔️</button>
        <button className={mode === 'rotate' ? 'active' : ''} onClick={() => setMode('rotate')} title="Aylantirish">🔄</button>
        <button className={mode === 'scale' ? 'active' : ''} onClick={() => setMode('scale')} title="O'lcham">⤢</button>
      </div>
      <div className="toggles">
        <label>
          <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />
          Wireframe
        </label>
        <label>
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Grid
        </label>
      </div>
      <div className="actions">
        <select 
          value={currentRoomId} 
          onChange={(e) => setCurrentRoomId(e.target.value)}
          style={{padding: '6px 10px', borderRadius: '6px', background: '#0f3460', color: 'white', border: '1px solid #e94560'}}
        >
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button onClick={onSave}>Saqlash</button>
        <button onClick={onLoad}>Yuklash</button>
      </div>
    </div>
  );
}

export default Toolbar;

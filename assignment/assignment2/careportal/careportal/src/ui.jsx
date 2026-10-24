import { useState } from "react";

export function Modal({ title, onClose, children }) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function Form({ fields, initial, onSave, onCancel, submit }) {
  const [v, setV] = useState(initial);
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(v); }}>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.options ? (
            <select required value={v[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
              <option value="">Select…</option>
              {f.options.map((o) => typeof o === "string"
                ? <option key={o}>{o}</option>
                : <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <input required type={f.type || "text"} value={v[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
          )}
        </label>
      ))}
      <div className="row end">
        <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
        <button>{submit}</button>
      </div>
    </form>
  );
}

export const Badge = ({ status }) => <span className={`badge ${status.toLowerCase()}`}>{status}</span>;

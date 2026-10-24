import { useState } from "react";
import { api } from "../api";
import { Modal, Form } from "../ui.jsx";

const FIELDS = [
  { name: "name", label: "Full name" },
  { name: "age", label: "Age", type: "number" },
  { name: "gender", label: "Gender", options: ["Female", "Male", "Other"] },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email", type: "email" },
  { name: "condition", label: "Condition" },
];

export default function Patients({ patients, appointments, reload }) {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // {mode, patient}
  const shown = patients.filter((p) =>
    [p.name, p.phone, p.email, p.condition].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const save = async (v) => {
    const data = { ...v, age: Number(v.age) };
    modal.mode === "edit" ? await api.update("patients", modal.patient.id, data) : await api.add("patients", data);
    setModal(null); reload();
  };
  const del = async (p) => {
    if (!window.confirm(`Delete ${p.name}? Their appointments will remain but show as Unknown.`)) return;
    await api.remove("patients", p.id); reload();
  };

  return (
    <>
      <div className="head">
        <h2>Patients</h2>
        <input className="search" placeholder="Search name, phone, condition" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={() => setModal({ mode: "add", patient: {} })}>Add patient</button>
      </div>
      {shown.length === 0 ? <p className="empty">No patients match “{q}”.</p> : (
        <table>
          <thead><tr><th>Name</th><th>Age</th><th>Phone</th><th>Condition</th><th></th></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.age}</td><td>{p.phone}</td><td>{p.condition}</td>
                <td className="actions">
                  <button className="link" onClick={() => setModal({ mode: "view", patient: p })}>View</button>
                  <button className="link" onClick={() => setModal({ mode: "edit", patient: p })}>Edit</button>
                  <button className="link danger" onClick={() => del(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modal?.mode === "view" && (
        <Modal title={modal.patient.name} onClose={() => setModal(null)}>
          <dl>{FIELDS.map((f) => <div key={f.name}><dt>{f.label}</dt><dd>{modal.patient[f.name]}</dd></div>)}</dl>
          <h4>Visit history</h4>
          <ul>
            {appointments.filter((a) => a.patientId === modal.patient.id).map((a) => (
              <li key={a.id}>{a.date} — {a.reason} ({a.status})</li>
            ))}
          </ul>
          <div className="row end"><button onClick={() => setModal(null)}>Close</button></div>
        </Modal>
      )}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal title={modal.mode === "add" ? "Add patient" : "Edit patient"} onClose={() => setModal(null)}>
          <Form fields={FIELDS} initial={modal.patient} onSave={save} onCancel={() => setModal(null)} submit="Save patient" />
        </Modal>
      )}
    </>
  );
}

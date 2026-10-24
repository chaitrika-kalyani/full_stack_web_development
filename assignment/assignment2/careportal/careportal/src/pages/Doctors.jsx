import { useState } from "react";
import { api } from "../api";
import { Modal, Form } from "../ui.jsx";

const FIELDS = [
  { name: "name", label: "Name" },
  { name: "specialization", label: "Specialization" },
  { name: "experience", label: "Years of experience", type: "number" },
  { name: "days", label: "Available days (e.g. Mon, Wed, Fri)" },
  { name: "hours", label: "Hours (e.g. 09:00 - 13:00)" },
];

export default function Doctors({ doctors, appointments, reload }) {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null);
  const shown = doctors.filter((d) => (d.name + d.specialization).toLowerCase().includes(q.toLowerCase()));

  const save = async (v) => {
    const data = { ...v, experience: Number(v.experience) };
    modal.doctor.id ? await api.update("doctors", modal.doctor.id, data) : await api.add("doctors", data);
    setModal(null); reload();
  };
  const del = async (d) => {
    if (window.confirm(`Remove ${d.name}?`)) { await api.remove("doctors", d.id); reload(); }
  };

  return (
    <>
      <div className="head">
        <h2>Doctors</h2>
        <input className="search" placeholder="Search name or specialization" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={() => setModal({ doctor: {} })}>Add doctor</button>
      </div>
      {shown.length === 0 && <p className="empty">No doctors match “{q}”.</p>}
      <section className="doctors">
        {shown.map((d) => (
          <article key={d.id}>
            <h3>{d.name}</h3>
            <p className="spec">{d.specialization} · {d.experience} yrs</p>
            <p>Sees patients <b>{d.days}</b></p>
            <p>{d.hours}</p>
            <p className="muted">{appointments.filter((a) => a.doctorId === d.id && a.status !== "Cancelled").length} active appointments</p>
            <div className="actions">
              <button className="link" onClick={() => setModal({ doctor: d })}>Edit</button>
              <button className="link danger" onClick={() => del(d)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
      {modal && (
        <Modal title={modal.doctor.id ? "Edit doctor" : "Add doctor"} onClose={() => setModal(null)}>
          <Form fields={FIELDS} initial={modal.doctor} onSave={save} onCancel={() => setModal(null)} submit="Save doctor" />
        </Modal>
      )}
    </>
  );
}

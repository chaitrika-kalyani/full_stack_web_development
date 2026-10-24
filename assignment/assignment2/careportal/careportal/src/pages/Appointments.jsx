import { useState } from "react";
import { api } from "../api";
import { Modal, Form, Badge } from "../ui.jsx";

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Appointments({ patients, doctors, appointments, reload }) {
  const [f, setF] = useState({ doctor: "", patient: "", date: "", status: "" });
  const [modal, setModal] = useState(null); // {mode:'book'|'reschedule', appt}
  const nameOf = (list, id) => list.find((x) => x.id === id)?.name ?? "Unknown";

  const shown = appointments
    .filter((a) =>
      (!f.doctor || a.doctorId === Number(f.doctor)) &&
      (!f.patient || a.patientId === Number(f.patient)) &&
      (!f.date || a.date === f.date) &&
      (!f.status || a.status === f.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // Returns an error message if the slot can't be used, otherwise "".
  const check = (doctorId, date, time, ignoreId) => {
    const doc = doctors.find((d) => d.id === Number(doctorId));
    if (doc && !doc.days.includes(DAY[new Date(date + "T00:00").getDay()]))
      return `${doc.name} isn't available on that day. Available: ${doc.days}.`;
    const clash = appointments.some((a) => a.id !== ignoreId && a.doctorId === Number(doctorId) &&
      a.date === date && a.time === time && a.status !== "Cancelled");
    return clash ? "That doctor already has an appointment at this time." : "";
  };

  const book = async (v) => {
    const err = check(v.doctorId, v.date, v.time);
    if (err) return alert(err);
    await api.add("appointments", { ...v, patientId: Number(v.patientId), doctorId: Number(v.doctorId), status: "Pending" });
    setModal(null); reload();
  };
  const reschedule = async (v) => {
    const err = check(modal.appt.doctorId, v.date, v.time, modal.appt.id);
    if (err) return alert(err);
    await api.update("appointments", modal.appt.id, { date: v.date, time: v.time });
    setModal(null); reload();
  };
  const setStatus = async (a, status) => { await api.update("appointments", a.id, { status }); reload(); };

  const bookFields = [
    { name: "patientId", label: "Patient", options: patients.map((p) => ({ value: p.id, label: p.name })) },
    { name: "doctorId", label: "Doctor", options: doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` })) },
    { name: "date", label: "Date", type: "date" },
    { name: "time", label: "Time", type: "time" },
    { name: "reason", label: "Reason for visit" },
  ];

  return (
    <>
      <div className="head">
        <h2>Appointments</h2>
        <button onClick={() => setModal({ mode: "book" })}>Book appointment</button>
      </div>
      <div className="filters">
        <select value={f.doctor} onChange={(e) => setF({ ...f, doctor: e.target.value })}>
          <option value="">All doctors</option>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={f.patient} onChange={(e) => setF({ ...f, patient: e.target.value })}>
          <option value="">All patients</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
          <option value="">Any status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="ghost" onClick={() => setF({ doctor: "", patient: "", date: "", status: "" })}>Clear filters</button>
      </div>
      {shown.length === 0 ? <p className="empty">No appointments match these filters.</p> : (
        <table>
          <thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Reason</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {shown.map((a) => {
              const closed = a.status === "Cancelled" || a.status === "Completed";
              return (
                <tr key={a.id}>
                  <td>{a.date} at {a.time}</td>
                  <td>{nameOf(patients, a.patientId)}</td>
                  <td>{nameOf(doctors, a.doctorId)}</td>
                  <td>{a.reason}</td>
                  <td><Badge status={a.status} /></td>
                  <td className="actions">
                    {a.status === "Pending" && <button className="link" onClick={() => setStatus(a, "Confirmed")}>Confirm</button>}
                    {a.status === "Confirmed" && <button className="link" onClick={() => setStatus(a, "Completed")}>Complete</button>}
                    {!closed && <button className="link" onClick={() => setModal({ mode: "reschedule", appt: a })}>Reschedule</button>}
                    {!closed && <button className="link danger" onClick={() => window.confirm("Cancel this appointment?") && setStatus(a, "Cancelled")}>Cancel</button>}
                    {a.status === "Cancelled" && <button className="link danger" onClick={async () => { await api.remove("appointments", a.id); reload(); }}>Delete</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {modal?.mode === "book" && (
        <Modal title="Book appointment" onClose={() => setModal(null)}>
          <Form fields={bookFields} initial={{}} onSave={book} onCancel={() => setModal(null)} submit="Book appointment" />
        </Modal>
      )}
      {modal?.mode === "reschedule" && (
        <Modal title={`Reschedule ${nameOf(patients, modal.appt.patientId)}`} onClose={() => setModal(null)}>
          <Form fields={bookFields.slice(2, 4)} initial={modal.appt} onSave={reschedule} onCancel={() => setModal(null)} submit="Save new time" />
        </Modal>
      )}
    </>
  );
}

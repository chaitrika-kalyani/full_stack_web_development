import { Badge } from "../ui.jsx";

export default function Dashboard({ patients, doctors, appointments, go }) {
  const pending = appointments.filter((a) => a.status === "Pending");
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments
    .filter((a) => a.date >= today && !["Cancelled", "Completed"].includes(a.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6);
  const name = (list, id) => list.find((x) => x.id === id)?.name ?? "Unknown";

  return (
    <>
      <h2>Overview</h2>
      <section className="stats">
        <div><b>{patients.length}</b><span>Patients</span></div>
        <div><b>{doctors.length}</b><span>Doctors</span></div>
        <div><b>{appointments.length}</b><span>Appointments</span></div>
        <div className="alert" onClick={() => go("Appointments")}><b>{pending.length}</b><span>Waiting for confirmation</span></div>
      </section>
      <h3>Next appointments</h3>
      {upcoming.length === 0 ? (
        <p className="empty">Nothing scheduled. Book an appointment from the Appointments page.</p>
      ) : (
        <table>
          <thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Status</th></tr></thead>
          <tbody>
            {upcoming.map((a) => (
              <tr key={a.id}>
                <td>{a.date} at {a.time}</td>
                <td>{name(patients, a.patientId)}</td>
                <td>{name(doctors, a.doctorId)}</td>
                <td><Badge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

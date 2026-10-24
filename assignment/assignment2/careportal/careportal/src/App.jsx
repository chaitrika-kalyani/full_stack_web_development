import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import Doctors from "./pages/Doctors.jsx";
import Appointments from "./pages/Appointments.jsx";

const PAGES = ["Dashboard", "Patients", "Doctors", "Appointments"];

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [data, setData] = useState({ patients: [], doctors: [], appointments: [] });
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      const [patients, doctors, appointments] = await Promise.all(
        ["patients", "doctors", "appointments"].map(api.list)
      );
      setData({ patients, doctors, appointments });
      setError("");
    } catch {
      setError("Can't reach the database. Start it with `npm run api` (port 3001).");
    }
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const props = { ...data, reload, go: setPage };
  return (
    <div className="shell">
      <aside>
        <h1>CarePortal</h1>
        <nav>
          {PAGES.map((p) => (
            <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
          ))}
        </nav>
      </aside>
      <main>
        {error && <p className="error">{error}</p>}
        {page === "Dashboard" && <Dashboard {...props} />}
        {page === "Patients" && <Patients {...props} />}
        {page === "Doctors" && <Doctors {...props} />}
        {page === "Appointments" && <Appointments {...props} />}
      </main>
    </div>
  );
}

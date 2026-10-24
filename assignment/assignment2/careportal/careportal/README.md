# CarePortal – Healthcare Appointment & Patient Portal

React + Vite front end with JSON Server as the dummy database.

## Run
```
npm install
npm start        # starts JSON Server (:3001) and Vite (:5173) together
```
Or separately: `npm run api` and `npm run dev`.

## Features
- Dashboard: patients, doctors, appointments, pending count, next appointments
- Patients: add, edit, delete, view (with visit history), search
- Doctors: profiles, specialization, available days and hours, search
- Appointments: book, reschedule, confirm, complete, cancel; filter by doctor, patient, date, status
- Booking checks doctor availability (day of week) and double-booking

Data lives in `db.json`; edit it to change the sample records.

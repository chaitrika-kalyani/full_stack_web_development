# EventHub — College Event Management System

A beginner-friendly full-stack group project built with:
- HTML, CSS, JavaScript
- React + Vite (frontend)
- JSON Server (dummy/sample database)
- Node.js + Express + MongoDB (real database option)

## Features
- Browse and search college events
- Filter by category
- View event details and seats remaining
- Register for an event
- View registrations in the admin panel
- Create and delete events (demo admin panel)
- Switch between JSON Server demo data and MongoDB API

## Requirements
Install Node.js (LTS) and npm. For MongoDB mode, use MongoDB Community Server or MongoDB Atlas.

## 1. Run the React frontend
Open a terminal in `client`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## 2. Run with JSON Server (recommended first)
Open another terminal in `json-server`:

```bash
npm install
npm run start
```

JSON Server runs at http://localhost:3001.

The frontend is configured to use JSON Server by default. It reads and writes:
- `GET /events`
- `GET /registrations`
- `POST /registrations`
- `POST /events`
- `DELETE /events/:id`

If JSON Server is not running, the event list will show an error message.

## 3. Run with MongoDB (optional full backend)
### Configure server
Open `server/.env.example`, copy it to `server/.env`, then update `MONGO_URI`.
For local MongoDB, the default URI is:

```env
MONGO_URI=mongodb://127.0.0.1:27017/eventhub
PORT=5000
```

For MongoDB Atlas, paste your database connection URI into `MONGO_URI`.

Then run:

```bash
cd server
npm install
npm run dev
```

The API runs at http://localhost:5000.

### Switch frontend to MongoDB API
Open `client/src/api.js` and change:

```js
export const DATA_MODE = "json-server";
```

to:

```js
export const DATA_MODE = "mongodb";
```

Then restart the frontend. Make sure the Express server and MongoDB are running.

## Sample demo flow
1. Browse events on the home page.
2. Click **Register** and submit name, email, and department.
3. Open **Admin** to view registrations and create events.
4. Try search and category filters.

## Suggested group division (4 members)
1. Frontend & navigation: React pages/components and CSS.
2. Events module: event cards, search, categories, event details.
3. Registration module: registration form and validation.
4. Backend & database: JSON Server, Express, MongoDB models, API testing.

## Notes
- This is a college-project starter/demo, not production-ready.
- Admin page has no authentication. Add login/authorization before deploying publicly.
- JSON Server and MongoDB are separate storage options. JSON Server is the easiest way to demonstrate with dummy records; MongoDB is the proper database-backed option.

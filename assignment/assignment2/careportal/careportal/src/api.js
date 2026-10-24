const BASE = "http://localhost:3001";
const send = (path, method, body) =>
  fetch(`${BASE}/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => {
    if (!r.ok) throw new Error(`Request failed (${r.status})`);
    return r.json();
  });

export const api = {
  list: (table) => send(table, "GET"),
  add: (table, data) => send(table, "POST", data),
  update: (table, id, data) => send(`${table}/${id}`, "PATCH", data),
  remove: (table, id) => send(`${table}/${id}`, "DELETE"),
};

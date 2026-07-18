# ResQConnect 🩸

A real-time platform connecting blood donors with patients and hospitals in emergencies — because finding a compatible donor shouldn't take hours.

## The problem

Emergency blood requests are still commonly handled through WhatsApp forwards and social media posts, causing critical delays. ResQConnect gives donors, patients, and hospitals a single, searchable, real-time place to find each other.

## Features

- **JWT authentication** — secure registration and login with hashed passwords
- **Geolocation-based donor search** — find the nearest available donors by blood group and city, sorted by real distance using MongoDB geospatial queries, visualized on an interactive map (Leaflet + OpenStreetMap)
- **Real-time emergency alerts** — new blood requests broadcast instantly to all connected users via Socket.io, with live toast notifications
- **Donor dashboard** — donors can toggle their availability and view their request history
- **Direct donor contact** — one-click email/call links on search results
- **Role-based admin panel** — admins can manage users and requests, protected at both the frontend and API level
- **Filter & sort** — active requests can be filtered by urgency/city and sorted by recency or severity

## Tech stack

**Frontend:** React (Vite), React Router, Axios, Socket.io-client, Leaflet, Lucide icons
**Backend:** Node.js, Express.js, Socket.io
**Database:** MongoDB Atlas + Mongoose (with geospatial indexing)
**Auth:** JWT, bcrypt

## Running locally

### Prerequisites
- Node.js (LTS)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
```bash
npx nodemon server.js
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Architecture notes

Donors self-register and are searchable community-wide (matching real-world platforms like eRaktKosh), rather than being tied to a single hospital — this keeps the donor pool useful across any hospital that posts a request, rather than fragmenting it.

## Author

Built by Aaditya Jadhav as a full-stack MERN project.
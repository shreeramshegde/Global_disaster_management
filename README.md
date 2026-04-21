# Base1 - Disaster Management System (Earthquake Monitoring)

Base1 is a DBMS-based full-stack web application for real-time earthquake monitoring. The backend fetches earthquake events from the USGS API, cleans the data, stores processed rows in Supabase PostgreSQL, and exposes APIs for the React dashboard. The frontend displays earthquake records with filters, charts, insights, and a 3D globe visualization.

## Tech Stack

Frontend:
- React with Vite
- Tailwind CSS
- shadcn/ui-style local UI components
- Recharts
- Globe.gl
- Lucide React icons

Backend:
- Node.js
- Express.js
- Axios
- csv-parser
- node-cron

Database:
- Supabase PostgreSQL

## Database Schema

Run this SQL in the Supabase SQL editor:

```sql
create table disaster_events (
id uuid primary key default gen_random_uuid(),
event_id text unique,
type text,
magnitude float,
place text,
latitude float,
longitude float,
event_time timestamp,
created_at timestamp default now()
);
```

The same SQL is also available in `backend/schema.sql`.

If Row Level Security is enabled, also run the policy SQL from `backend/rls-policies.sql`. Without these policies, the backend will read successfully but inserts/upserts will fail with:

```text
new row violates row-level security policy for table "disaster_events"
```

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install
```

Create or update `backend/.env`:

```env
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_key_here
PORT=5001
NASA_FIRMS_MAP_KEY=your_firms_map_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
```

Do not hardcode Supabase credentials in source files.

### How To Get Supabase Keys

1. Go to your Supabase dashboard.
2. Open your project.
3. Go to Settings -> API.
4. Copy:
   - Project URL
   - anon public key
5. Paste them into `backend/.env`.

### Run Backend

```bash
cd backend
npm run dev
```

When the backend starts, it automatically fetches earthquake data from:

```text
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
```

It also refreshes the pipeline every 10 minutes.

Wildfire support uses NASA FIRMS. Create a FIRMS map key from the NASA FIRMS site and add it to `NASA_FIRMS_MAP_KEY`. If this key is missing, earthquake sync still works and wildfire sync is skipped with a clear message.

Flood support uses OpenWeather forecast data. Add `OPENWEATHER_API_KEY` from OpenWeather. The app estimates flood risk from rainfall, humidity, and continuous rain windows.

### Flood Column Migration

Flood records store the calculated OpenWeather rainfall risk as severity text. Run this once in the Supabase SQL editor:

```sql
alter table disaster_events
add column if not exists severity text;
```

The same SQL is available in `backend/add_flood_column.sql`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The backend API is expected at:

```text
http://localhost:5001
```

To use a different backend URL, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001
```

## Backend API Endpoints

### `GET /events`

Returns all stored disaster events ordered by newest event time. You can filter by type:

```bash
curl "http://localhost:5001/events?type=earthquake"
curl "http://localhost:5001/events?type=wildfire"
curl "http://localhost:5001/events?type=flood"
```

### `GET /events/filter`

Filters events by query parameters:

```text
type=earthquake
startDate=2026-04-20
endDate=2026-04-21
minMagnitude=2.5
maxMagnitude=6
search=Alaska
```

Example:

```bash
curl "http://localhost:5001/events/filter?type=earthquake&minMagnitude=3.5"
```

### `GET /events/sync` or `POST /events/sync`

Manually triggers the USGS pipeline and upserts cleaned records into Supabase.

## How Data Pipeline Works

The app implements Method 2: Automatic API Pipeline.

```text
USGS API -> Backend fetch -> Clean and filter -> Supabase upsert -> Frontend API fetch -> Dashboard and globe
```

Pipeline details:

1. Backend fetches the USGS all-day GeoJSON feed, NASA FIRMS wildfire CSV data, and OpenWeather forecast data.
2. It filters only earthquake events with `magnitude > 2.5`; wildfire brightness and flood rainfall amount are stored in the shared `magnitude` column.
3. It transforms each source record into the database shape:
   - `event_id`
   - `type`
   - `magnitude`
   - `place`
   - `latitude`
   - `longitude`
   - `event_time`
4. It upserts into Supabase using `event_id` as the unique key.
5. The frontend reads processed records from the backend.

## Important Notes

- Earthquake, wildfire, and flood data are automatically fetched when the backend starts.
- A cron job fetches fresh data every 10 minutes.
- No manual JSON upload is needed.
- Raw USGS JSON is not stored directly.
- Supabase stores cleaned, processed earthquake rows.
- The frontend shows sample fallback data if the backend is unavailable, so the UI can still be previewed before credentials are configured.

## Project Structure

```text
backend/
├── config/
│   └── supabase.js
├── index.js
├── routes/
│   └── events.js
├── schema.sql
├── scripts/
│   └── fetchEarthquakes.js
├── services/
│   └── earthquakeService.js
└── .env

frontend/
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
└── index.html
```

## Final Goal

When the app runs:

1. Backend fetches and stores earthquake data from USGS.
2. Supabase contains cleaned rows in `disaster_events`.
3. Frontend displays:
   - Events table
   - Event type switching
   - Events over time chart
   - Severity pie chart
   - Insights section
   - 3D disaster globe with earthquake and wildfire legend

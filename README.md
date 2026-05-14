# GLOBAL DISASTER MANAGEMENT SYSTEM

GLOBAL DISASTER MANAGEMENT SYSTEM is a full-stack DBMS project for monitoring earthquakes, wildfires, floods, and conflict events. The project now includes admin authentication, 5+ normalized tables, protected manual CRUD, PostgreSQL trigger automation, and safer backend validation without breaking external read-only ingestion.

## Final Architecture

The normalized database now centers around these tables:

1. `event_types`
2. `locations`
3. `disaster_events`
4. existing external/support tables already present in your Supabase project
5. `admin_users`

### Why normalization was used

- `event_types` removes repeated disaster type strings from every event row.
- `locations` removes repeated place/coordinate combinations.
- `disaster_events` stores the actual event facts and references normalized lookup tables.
- `admin_users` isolates authentication data from disaster records.
- This reduces duplication, improves consistency, and makes updates safer.

## Admin Authentication Flow

Admin authentication is only for Admin Mode.

### Backend auth stack

- `bcryptjs` hashes passwords before storage.
- `jsonwebtoken` creates signed JWT tokens.
- `backend/middleware/authMiddleware.js` protects write endpoints.

### Endpoints

- `POST /admin/register`
  Creates an admin user in `admin_users`, hashes the password, and returns a JWT.
- `POST /admin/login`
  Validates username/email plus password and returns a JWT.

### Protected routes

These now require `Authorization: Bearer <token>`:

- `POST /events`
- `PUT /events/:id`
- `DELETE /events/:id`

### Frontend auth flow

- Admin opens `/admin/login`
- Admin registers or logs in
- JWT is stored in localStorage
- Dashboard unlocks Admin Mode and shows the admin badge
- Protected CRUD requests include the JWT automatically

## CRUD Restrictions

Only manual rows are editable.

- `source_type = 'manual'`
  Create, update, and soft delete allowed for authenticated admins
- `source_type = 'external'`
  Read-only, cannot be updated, cannot be hard deleted

This is enforced in two places:

- backend service validation
- PostgreSQL delete-protection trigger

## Trigger Explanation

The database now has three triggers in `backend/sql/01_normalized_schema.sql`.

### 1. `updated_at` trigger

- Automatically updates `updated_at` whenever a disaster row changes
- Keeps timestamps consistent even if rows are edited outside the Express API

### 2. Severity automation trigger

- Runs on `INSERT` and `UPDATE`
- Automatically sets severity from magnitude:
  - `< 3` -> `Low`
  - `3 to 6` -> `Medium`
  - `> 6` -> `High`
- Prevents drift between frontend, backend scripts, and direct SQL edits

### 3. External delete protection trigger

- Rejects hard deletes for `source_type = 'external'`
- Protects imported third-party data at the database level

## Soft Delete Design

Manual delete is implemented as a soft delete:

- row is kept in the table
- `is_deleted = true`
- normal reads exclude deleted rows

Why soft delete is used:

- preserves auditability
- avoids accidental data loss
- keeps external and manual history safer

## SQL Files You Should Run In Supabase

Run these in the Supabase SQL Editor in this order.

### 1. Main schema

File: `backend/sql/01_normalized_schema.sql`

This creates:

- `event_types`
- `locations`
- `disaster_events`
- `admin_users`
- indexes
- `updated_at` trigger
- severity automation trigger
- external delete protection trigger

### 2. RLS policies

File: `backend/sql/02_rls_policies.sql`

Use this if your backend is not using the service role key.  
Important: `admin_users` is denied for `anon` access by design.

### 3. Dummy manual seed

File: `backend/sql/03_seed_dummy_manual_events.sql`

This inserts sample manual rows for testing admin CRUD.

### 4. Optional conflict import

File: `backend/sql/acled_conflict_events.sql`

This inserts external conflict rows.

### Compatibility files

These were also updated so your project docs stay aligned:

- `backend/schema.sql`
- `backend/rls-policies.sql`
- `backend/add_flood_column.sql`

## What You Must Add In Supabase

In Supabase, do these exact steps:

1. Create a project.
2. Open `Settings -> API`.
3. Copy:
   - `Project URL`
   - `anon public key`
   - `service_role key`
4. Open `SQL Editor`.
5. Run `backend/sql/01_normalized_schema.sql`.
6. If you are using anon-key-based backend access, also run `backend/sql/02_rls_policies.sql`.
7. Optionally run:
   - `backend/sql/03_seed_dummy_manual_events.sql`
   - `backend/sql/acled_conflict_events.sql`

### Important Supabase requirement

For admin authentication, you should use:

- `SUPABASE_SERVICE_ROLE_KEY`

Why:

- the backend must securely read and insert `admin_users`
- `admin_users` is intentionally blocked from public anon access
- password hashes should never be exposed through public policies

## Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
ADMIN_JWT_SECRET=replace_with_a_long_random_secret
PORT=5001
NASA_FIRMS_MAP_KEY=your_firms_map_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001
```

## Backend Changes Included

- Added `backend/routes/admin.js`
- Added `backend/services/adminAuthService.js`
- Added `backend/middleware/authMiddleware.js`
- Protected event write routes with JWT middleware
- Fixed manual event update flow in `backend/services/eventStore.js`
- Removed manual `updated_at` handling from app code so DB trigger stays authoritative
- Aligned validation and severity derivation with trigger rules

## Frontend Changes Included

- Added `frontend/src/pages/AdminLogin.jsx`
- Added local admin session storage
- Added JWT-based authenticated write requests
- Admin Mode only appears after login
- Added admin badge
- Added edit modal
- Added delete confirmation dialog
- Fixed edit form state handling
- Refreshes table, charts, and open globe views after CRUD

## Update/Edit Fix Summary

The broken edit flow was fixed by:

- validating event existence before update
- blocking updates unless `source_type = 'manual'`
- properly updating location, magnitude, severity, and event time
- using controlled React form state instead of fragile default-value remounting
- reloading event data after save so charts and table reflect changes immediately

## Install And Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Verification Checklist

- Admin can register and login
- JWT is returned and stored
- Admin Mode appears only after login
- Manual events can be created
- Manual events can be edited
- Manual events can be soft deleted
- External events stay read-only
- `updated_at` changes automatically on update
- severity is assigned automatically by trigger
- hard delete on external rows is rejected by PostgreSQL

## Notes

- Frontend production build passes.
- Backend syntax check passes for the new auth and route modules.
- Vite still reports a large bundle-size warning, but the build succeeds.

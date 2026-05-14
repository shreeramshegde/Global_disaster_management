import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = process.argv[2] || path.resolve(__dirname, "../csv/ACLED Data_2026-04-22.csv");
const outputPath = process.argv[3] || path.resolve(__dirname, "../sql/acled_conflict_events.sql");
const maxRows = Number(process.argv[4] || 300);
const batchSize = 100;

const rows = [];

const escapeSql = (value) => String(value ?? "").replace(/'/g, "''");

const isoDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const toNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildTuple = (row) => {
  const eventId = row.data_id || row.event_id_cnty || row["\ufeffevent_id_cnty"];
  const latitude = toNumber(row.latitude);
  const longitude = toNumber(row.longitude);
  const magnitude = toNumber(row.fatalities, 0);
  const place = row.country || "Unknown";
  const eventTime = isoDate(row.event_date);
  const severity = magnitude > 6 ? "High" : magnitude >= 3 ? "Medium" : "Low";

  if (!eventId || latitude === null || longitude === null || !eventTime) return null;

  return `('${escapeSql(eventId)}', '${escapeSql(place)}', ${latitude}, ${longitude}, ${magnitude}, '${severity}', '${eventTime}'::timestamp)`;
};

const writeSqlFile = () => {
  const statements = [
    "insert into event_types (name)\nvalues ('conflict')\non conflict (name) do nothing;"
  ];

  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    statements.push(
      `with batch_data (event_id, place, latitude, longitude, magnitude, severity, event_time) as (\n  values\n  ${batch.join(",\n  ")}\n),\ninserted_locations as (\n  insert into locations (place, latitude, longitude)\n  select distinct place, latitude, longitude\n  from batch_data\n  on conflict (place, latitude, longitude) do nothing\n  returning id, place, latitude, longitude\n),\nall_locations as (\n  select id, place, latitude, longitude from inserted_locations\n  union\n  select l.id, l.place, l.latitude, l.longitude\n  from locations l\n  join batch_data b\n    on b.place = l.place\n   and b.latitude = l.latitude\n   and b.longitude = l.longitude\n)\ninsert into disaster_events (\n  event_id,\n  event_type_id,\n  location_id,\n  magnitude,\n  severity,\n  event_time,\n  source_type,\n  is_deleted\n)\nselect\n  b.event_id,\n  et.id,\n  al.id,\n  b.magnitude,\n  b.severity,\n  b.event_time,\n  'external',\n  false\nfrom batch_data b\njoin event_types et on et.name = 'conflict'\njoin all_locations al\n  on al.place = b.place\n and al.latitude = b.latitude\n and al.longitude = b.longitude\non conflict (event_id) do update set\n  event_type_id = excluded.event_type_id,\n  location_id = excluded.location_id,\n  magnitude = excluded.magnitude,\n  severity = excluded.severity,\n  event_time = excluded.event_time,\n  source_type = excluded.source_type,\n  is_deleted = false,\n  updated_at = now();`
    );
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${statements.join("\n\n")}\n`);
  console.log(`Wrote ${rows.length} conflict rows to ${outputPath}`);
};

fs.createReadStream(inputPath)
  .pipe(csv())
  .on("data", (row) => {
    if (rows.length >= maxRows) return;
    const tuple = buildTuple(row);
    if (tuple) rows.push(tuple);
  })
  .on("end", writeSqlFile)
  .on("error", (error) => {
    console.error(error.message);
    process.exit(1);
  });

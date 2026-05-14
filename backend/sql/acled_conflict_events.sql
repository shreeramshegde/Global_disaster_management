insert into event_types (name)
values ('conflict')
on conflict (name) do nothing;

with batch_data (event_id, place, latitude, longitude, magnitude, severity, event_time) as (
  values
  ('IRQ63650', 'Iraq', 37.0992, 43.6066, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63670', 'Iraq', 37.0992, 43.6066, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63689', 'Iraq', 37.0879, 43.5925, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63830', 'Iraq', 37.0992, 43.6066, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('COL31560', 'Colombia', 5.3006, -76.3325, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BFO13578', 'Burkina Faso', 11.5833, 1.4667, 3, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BFO13579', 'Burkina Faso', 12.648, 0.493, 3, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BFO13581', 'Burkina Faso', 12.7678, 1.262, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BOL7216', 'Bolivia', -17.7863, -63.1812, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BRA96050', 'Brazil', -22.7253, -47.6492, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96051', 'Brazil', -15.555, -54.2912, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BRA96084', 'Brazil', -19.4659, -42.5477, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96085', 'Brazil', -9.9747, -67.81, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96097', 'Brazil', -0.9304, -52.4268, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('BRA96146', 'Brazil', -29.9862, -50.1255, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96147', 'Brazil', 0.0389, -51.0664, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BRA96148', 'Brazil', -19.7697, -43.8514, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BRA96171', 'Brazil', 2.4975, -50.9486, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96219', 'Brazil', -18.8564, -41.9547, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96220', 'Brazil', -7.115, -34.8631, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('BRA96229', 'Brazil', -2.5833, -49.5056, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BRA96235', 'Brazil', -13.8257, -56.0845, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('BRA96249', 'Brazil', -9.6658, -35.7353, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('BRA96265', 'Brazil', -12.0122, -38.7477, 2, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('CAO16764', 'Cameroon', 11.0485, 14.1476, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('CEN50377', 'Central African Republic', 8.5186, 23.2622, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('CHI12954', 'Chile', -38.0168, -72.4261, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('COL31497', 'Colombia', 5.6568, -75.8788, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('COL31498', 'Colombia', 6.2193, -75.9486, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('COL31539', 'Colombia', 8.2763, -73.8681, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('COL31565', 'Colombia', 2.9356, -75.2777, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('COL31574', 'Colombia', 10.233, -74.4939, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('COL31590', 'Colombia', 8.4905, -72.6397, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('COL31603', 'Colombia', 7.3491, -73.8993, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('DRC35368', 'Democratic Republic of Congo', -1.6717, 29.2272, 3, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('ETH15184', 'Ethiopia', 11.3229, 37.2954, 3, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('ETH15194', 'Ethiopia', 10.8551, 37.0206, 3, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('ETH15195', 'Ethiopia', 11.613, 38.0622, 10, 'Medium', '2025-04-02T00:00:00.000Z'::timestamp),
  ('ETH15196', 'Ethiopia', 11.85, 38.3667, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('GHA2860', 'Ghana', 7.0561, -1.4042, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('GTM8978', 'Guatemala', 14.6225, -90.5184, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('GTM8979', 'Guatemala', 14.9655, -89.291, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('GTM9014', 'Guatemala', 14.6306, -90.6067, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('GTM9015', 'Guatemala', 14.6306, -90.6067, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('HND10670', 'Honduras', 15.6144, -87.953, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('HND10671', 'Honduras', 14.1059, -87.2328, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('HND10672', 'Honduras', 14.6, -87.8333, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('HND10679', 'Honduras', 15.0702, -88.7363, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('HND10681', 'Honduras', 14.1059, -87.2328, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('HND10682', 'Honduras', 14.7874, -86.8597, 3, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('HTI9401', 'Haiti', 18.5502, -72.3155, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('HTI9412', 'Haiti', 18.5833, -72.2667, 5, 'Medium', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63649', 'Iraq', 37.1618, 43.2863, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63651', 'Iraq', 37.1683, 43.2709, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63652', 'Iraq', 36.9406, 43.7469, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63653', 'Iraq', 37.1459, 43.5907, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63654', 'Iraq', 36.9599, 44.6039, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63655', 'Iraq', 37.0394, 43.5175, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63671', 'Iraq', 37.1618, 43.2863, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63672', 'Iraq', 37.1693, 43.3154, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63716', 'Iraq', 31.8356, 47.1448, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63717', 'Iraq', 33.3164, 44.3591, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63723', 'Iraq', 30.1165, 47.7164, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63737', 'Iraq', 31.2035, 45.5643, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63760', 'Iraq', 36.2955, 41.8932, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63761', 'Iraq', 37.0484, 43.5314, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63763', 'Iraq', 37.0416, 43.59, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63764', 'Iraq', 36.9858, 43.5713, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63766', 'Iraq', 37.0478, 43.5593, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63767', 'Iraq', 37.1538, 43.385, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63768', 'Iraq', 36.8747, 43.7208, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('IRQ63769', 'Iraq', 37.0484, 43.5314, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63772', 'Iraq', 37.1618, 43.2863, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63773', 'Iraq', 37.1134, 43.511, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63774', 'Iraq', 37.0416, 43.59, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63775', 'Iraq', 36.9858, 43.5713, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63777', 'Iraq', 37.0478, 43.5593, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63779', 'Iraq', 37.1683, 43.2709, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63780', 'Iraq', 36.8747, 43.7208, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('IRQ63802', 'Iraq', 37.1134, 43.511, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63803', 'Iraq', 37.0416, 43.59, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63805', 'Iraq', 37.0478, 43.5593, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63806', 'Iraq', 37.1683, 43.2709, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63807', 'Iraq', 37.0359, 43.5713, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63808', 'Iraq', 36.8747, 43.7208, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('IRQ63829', 'Iraq', 37.1134, 43.511, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('IRQ63831', 'Iraq', 37.0416, 43.59, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('IRQ63833', 'Iraq', 37.0478, 43.5593, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('IRQ63834', 'Iraq', 37.1683, 43.2709, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('IRQ63835', 'Iraq', 37.0359, 43.5713, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('IRQ63836', 'Iraq', 36.8747, 43.7208, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('JAM3028', 'Jamaica', 18.3928, -77.3677, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('LBN33768', 'Lebanon', 33.5599, 35.3756, 3, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('LBN33769', 'Lebanon', 33.8537, 35.5155, 4, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('LBN33770', 'Lebanon', 33.1042, 35.1819, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('LBN33785', 'Lebanon', 33.1511, 35.1995, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('LBY12098', 'Libya', 32.1722, 13.0203, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('LBY12125', 'Libya', 32.7571, 12.7276, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('LBY12126', 'Libya', 31.9223, 12.252, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('LBY12128', 'Libya', 32.8414, 13.2099, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp)
),
inserted_locations as (
  insert into locations (place, latitude, longitude)
  select distinct place, latitude, longitude
  from batch_data
  on conflict (place, latitude, longitude) do nothing
  returning id, place, latitude, longitude
),
all_locations as (
  select id, place, latitude, longitude from inserted_locations
  union
  select l.id, l.place, l.latitude, l.longitude
  from locations l
  join batch_data b
    on b.place = l.place
   and b.latitude = l.latitude
   and b.longitude = l.longitude
)
insert into disaster_events (
  event_id,
  event_type_id,
  location_id,
  magnitude,
  severity,
  event_time,
  source_type,
  is_deleted
)
select
  b.event_id,
  et.id,
  al.id,
  b.magnitude,
  b.severity,
  b.event_time,
  'external',
  false
from batch_data b
join event_types et on et.name = 'conflict'
join all_locations al
  on al.place = b.place
 and al.latitude = b.latitude
 and al.longitude = b.longitude
on conflict (event_id) do update set
  event_type_id = excluded.event_type_id,
  location_id = excluded.location_id,
  magnitude = excluded.magnitude,
  severity = excluded.severity,
  event_time = excluded.event_time,
  source_type = excluded.source_type,
  is_deleted = false,
  updated_at = now();

with batch_data (event_id, place, latitude, longitude, magnitude, severity, event_time) as (
  values
  ('MEX102017', 'Mexico', 21.436, -102.5726, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102018', 'Mexico', 19.0679, -102.2488, 3, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102020', 'Mexico', 19.8877, -102.2052, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102025', 'Mexico', 16.8619, -99.8866, 3, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102030', 'Mexico', 16.8619, -99.8866, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102033', 'Mexico', 18.9218, -99.2349, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102034', 'Mexico', 20.6386, -103.3072, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102038', 'Mexico', 19.6709, -99.0857, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102040', 'Mexico', 19.359, -99.0926, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102052', 'Mexico', 32.5325, -117.019, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102053', 'Mexico', 18.9428, -98.1561, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102054', 'Mexico', 25.7813, -100.1892, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102056', 'Mexico', 20.6764, -103.3422, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102057', 'Mexico', 20.6386, -103.3072, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102058', 'Mexico', 19.9836, -102.286, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102059', 'Mexico', 19.2829, -98.4355, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102061', 'Mexico', 27.3543, -110.033, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102062', 'Mexico', 23.2932, -102.3495, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102063', 'Mexico', 20.5327, -98.6389, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('MEX102067', 'Mexico', 24.1487, -110.307, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102068', 'Mexico', 20.2519, -99.6454, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102069', 'Mexico', 19.0872, -102.3553, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102072', 'Mexico', 17.5516, -99.5011, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102073', 'Mexico', 25.8005, -100.5855, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('MEX102086', 'Mexico', 32.5325, -117.019, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102087', 'Mexico', 20.6233, -103.2456, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102088', 'Mexico', 19.6475, -99.1692, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102089', 'Mexico', 19.7888, -100.9682, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102090', 'Mexico', 18.5739, -98.4404, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102094', 'Mexico', 16.8619, -99.8866, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102096', 'Mexico', 20.6386, -103.3072, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102097', 'Mexico', 18.4622, -97.392, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102098', 'Mexico', 19.3305, -98.5824, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102099', 'Mexico', 18.7933, -97.6629, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102100', 'Mexico', 23.1749, -102.8682, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102101', 'Mexico', 23.1749, -102.8682, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102102', 'Mexico', 18.9727, -91.1778, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('MEX102105', 'Mexico', 16.8619, -99.8866, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('MEX102106', 'Mexico', 17.5516, -99.5011, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('MEX102107', 'Mexico', 20.4736, -103.4431, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('MEX102109', 'Mexico', 25.0823, -107.7018, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('MEX102113', 'Mexico', 25.897, -100.1082, 2, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MEX102114', 'Mexico', 14.9111, -92.2643, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102115', 'Mexico', 20.4572, -100.6216, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102116', 'Mexico', 19.6475, -99.1692, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102117', 'Mexico', 24.825, -100.0768, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102122', 'Mexico', 20.4736, -103.4431, 3, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102154', 'Mexico', 17.5516, -99.5011, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MEX102302', 'Mexico', 19.0269, -102.4481, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('MLI34129', 'Mali', 19.9486, 2.9649, 6, 'Medium', '2025-04-01T00:00:00.000Z'::timestamp),
  ('MOR13540', 'Morocco', 26.1477, -11.0691, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('NIG41445', 'Nigeria', 7.1962, 5.5868, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('NIG41446', 'Nigeria', 13.1965, 6.4489, 11, 'Medium', '2025-04-03T00:00:00.000Z'::timestamp),
  ('NIG41453', 'Nigeria', 9.0042, 7.2704, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('NIG41460', 'Nigeria', 5.3898, 7.914, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('NIG41474', 'Nigeria', 11.1503, 12.7599, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('NIG41481', 'Nigeria', 12.2672, 6.5475, 2, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('NIG41485', 'Nigeria', 12.7217, 5.0156, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('NIG41490', 'Nigeria', 9.2333, 8.85, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('NIG41491', 'Nigeria', 9.2333, 8.85, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PER11222', 'Peru', -3.726, -73.2488, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PRT2288', 'Puerto Rico', 18.2544, -65.9729, 2, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71195', 'Palestine', 32.4596, 35.4152, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71196', 'Palestine', 32.4594, 35.3009, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71203', 'Palestine', 32.4594, 35.3009, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71206', 'Palestine', 31.8667, 35.2167, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71211', 'Palestine', 31.6941, 35.1669, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71213', 'Palestine', 32.3086, 35.19, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71215', 'Palestine', 32.4594, 35.3009, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71218', 'Palestine', 32.2211, 35.2544, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71220', 'Palestine', 31.8667, 35.2167, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71223', 'Palestine', 32.0722, 35.0994, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71224', 'Palestine', 32.4594, 35.3009, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71237', 'Palestine', 31.8092, 35.259, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71319', 'Palestine', 32.5085, 35.2275, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71322', 'Palestine', 32.4167, 35.1667, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71324', 'Palestine', 31.323, 34.2761, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71329', 'Palestine', 31.3739, 34.3409, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71337', 'Palestine', 31.2855, 34.2714, 2, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71339', 'Palestine', 31.4964, 34.4522, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71343', 'Palestine', 31.2855, 34.2714, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71346', 'Palestine', 31.2855, 34.2714, 3, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71347', 'Palestine', 31.2855, 34.2714, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71356', 'Palestine', 31.4214, 34.3865, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71358', 'Palestine', 31.5134, 34.4751, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71361', 'Palestine', 31.4105, 34.378, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71362', 'Palestine', 31.3083, 34.288, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71364', 'Palestine', 31.4591, 34.3923, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71370', 'Palestine', 31.4178, 34.3503, 4, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71375', 'Palestine', 31.4394, 34.4031, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71378', 'Palestine', 31.4394, 34.4031, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71379', 'Palestine', 31.4394, 34.4031, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71383', 'Palestine', 31.4486, 34.3925, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71384', 'Palestine', 31.4486, 34.3925, 3, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71385', 'Palestine', 31.4486, 34.3925, 2, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71386', 'Palestine', 31.4486, 34.3925, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71389', 'Palestine', 31.4591, 34.3923, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71390', 'Palestine', 31.4591, 34.3923, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71400', 'Palestine', 31.4005, 34.3375, 2, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71401', 'Palestine', 31.4675, 34.4097, 2, 'Low', '2025-04-01T00:00:00.000Z'::timestamp)
),
inserted_locations as (
  insert into locations (place, latitude, longitude)
  select distinct place, latitude, longitude
  from batch_data
  on conflict (place, latitude, longitude) do nothing
  returning id, place, latitude, longitude
),
all_locations as (
  select id, place, latitude, longitude from inserted_locations
  union
  select l.id, l.place, l.latitude, l.longitude
  from locations l
  join batch_data b
    on b.place = l.place
   and b.latitude = l.latitude
   and b.longitude = l.longitude
)
insert into disaster_events (
  event_id,
  event_type_id,
  location_id,
  magnitude,
  severity,
  event_time,
  source_type,
  is_deleted
)
select
  b.event_id,
  et.id,
  al.id,
  b.magnitude,
  b.severity,
  b.event_time,
  'external',
  false
from batch_data b
join event_types et on et.name = 'conflict'
join all_locations al
  on al.place = b.place
 and al.latitude = b.latitude
 and al.longitude = b.longitude
on conflict (event_id) do update set
  event_type_id = excluded.event_type_id,
  location_id = excluded.location_id,
  magnitude = excluded.magnitude,
  severity = excluded.severity,
  event_time = excluded.event_time,
  source_type = excluded.source_type,
  is_deleted = false,
  updated_at = now();

with batch_data (event_id, place, latitude, longitude, magnitude, severity, event_time) as (
  values
  ('PSE71402', 'Palestine', 31.4675, 34.4097, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71403', 'Palestine', 31.4675, 34.4097, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71408', 'Palestine', 31.5045, 34.4743, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71409', 'Palestine', 31.5045, 34.4743, 8, 'Medium', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71411', 'Palestine', 31.5045, 34.4743, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71413', 'Palestine', 31.5349, 34.4466, 3, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71414', 'Palestine', 31.5349, 34.4466, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71415', 'Palestine', 31.5098, 34.4274, 2, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71417', 'Palestine', 31.5134, 34.4751, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71419', 'Palestine', 31.5134, 34.4751, 35, 'High', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71422', 'Palestine', 31.4864, 34.4738, 25, 'High', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71427', 'Palestine', 31.4964, 34.4522, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71429', 'Palestine', 31.534, 34.4574, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71431', 'Palestine', 31.484, 34.4056, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71433', 'Palestine', 31.5086, 34.4493, 3, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71439', 'Palestine', 31.4988, 34.4699, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71440', 'Palestine', 31.4988, 34.4699, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71441', 'Palestine', 31.4988, 34.4699, 35, 'High', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71442', 'Palestine', 31.4988, 34.4699, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71444', 'Palestine', 31.4988, 34.4699, 2, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71445', 'Palestine', 31.4988, 34.4699, 3, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71450', 'Palestine', 31.5245, 34.4326, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71453', 'Palestine', 31.3416, 34.3459, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71459', 'Palestine', 31.3191, 34.3401, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71460', 'Palestine', 31.3191, 34.3401, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71462', 'Palestine', 31.3191, 34.3401, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71466', 'Palestine', 31.3154, 34.3127, 5, 'Medium', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71467', 'Palestine', 31.3154, 34.3127, 25, 'High', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71471', 'Palestine', 31.3482, 34.2547, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71472', 'Palestine', 31.3482, 34.2547, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71473', 'Palestine', 31.3482, 34.2547, 6, 'Medium', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71477', 'Palestine', 31.3739, 34.3409, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71480', 'Palestine', 31.3424, 34.325, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71481', 'Palestine', 31.3424, 34.325, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71482', 'Palestine', 31.3424, 34.325, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71483', 'Palestine', 31.3424, 34.325, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71484', 'Palestine', 31.3424, 34.325, 4, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71494', 'Palestine', 31.3502, 34.3081, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71495', 'Palestine', 31.3502, 34.3081, 13, 'Medium', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71496', 'Palestine', 31.3502, 34.3081, 23, 'High', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71497', 'Palestine', 31.3502, 34.3081, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71498', 'Palestine', 31.3544, 34.3007, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71499', 'Palestine', 31.3642, 34.3085, 10, 'Medium', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71500', 'Palestine', 31.3369, 34.2925, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71502', 'Palestine', 31.3624, 34.2949, 5, 'Medium', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71504', 'Palestine', 31.3314, 34.3004, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71505', 'Palestine', 31.3314, 34.3004, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71506', 'Palestine', 31.336, 34.3172, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71507', 'Palestine', 31.336, 34.3172, 8, 'Medium', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71508', 'Palestine', 31.336, 34.3172, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71509', 'Palestine', 31.336, 34.3172, 4, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71510', 'Palestine', 31.336, 34.3172, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71512', 'Palestine', 31.3484, 34.2961, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71513', 'Palestine', 31.3484, 34.2961, 6, 'Medium', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71514', 'Palestine', 31.3691, 34.2734, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71515', 'Palestine', 31.3691, 34.2734, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71517', 'Palestine', 31.3069, 34.3572, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71518', 'Palestine', 31.3069, 34.3572, 2, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71521', 'Palestine', 31.323, 34.2761, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71522', 'Palestine', 31.323, 34.2761, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71523', 'Palestine', 31.323, 34.2761, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71529', 'Palestine', 31.5541, 34.5016, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71531', 'Palestine', 31.5541, 34.5016, 3, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71534', 'Palestine', 31.5163, 34.5115, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71536', 'Palestine', 31.5272, 34.4835, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71540', 'Palestine', 31.536, 34.4907, 22, 'High', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71549', 'Palestine', 31.3294, 34.2299, 1, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71550', 'Palestine', 31.2814, 34.3025, 9, 'Medium', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71551', 'Palestine', 31.2814, 34.3025, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71552', 'Palestine', 31.2814, 34.3025, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71556', 'Palestine', 31.2855, 34.2714, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71563', 'Palestine', 31.287, 34.2595, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71566', 'Palestine', 31.287, 34.2595, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71567', 'Palestine', 31.287, 34.2595, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('PSE71568', 'Palestine', 31.287, 34.2595, 0, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('PSE71580', 'Palestine', 31.3098, 34.2414, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('PSE71584', 'Palestine', 31.2842, 34.2482, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71585', 'Palestine', 31.2842, 34.2482, 4, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('PSE71586', 'Palestine', 31.2842, 34.2482, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('SOM49639', 'Somalia', 10.8548, 49.7434, 3, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SOM49640', 'Somalia', 3.1808, 46.4354, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('SOM49641', 'Somalia', 2.2983, 45.798, 3, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('SOM49642', 'Somalia', 2.9822, 46.2872, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('SOM49645', 'Somalia', 2.9373, 46.0126, 0, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('SOM49647', 'Somalia', 10.8548, 49.7434, 3, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('SOM49678', 'Somalia', 2.0678, 45.35, 0, 'Low', '2025-04-02T00:00:00.000Z'::timestamp),
  ('SOM49680', 'Somalia', 6.1478, 46.3964, 2, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SOM49693', 'Somalia', 3.7807, 41.8943, 0, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SOM49697', 'Somalia', 3.7742, 46.2499, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SOM49698', 'Somalia', 1.7087, 44.6961, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('SOM49699', 'Somalia', 1.7493, 44.7437, 1, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('SOM49700', 'Somalia', 1.9243, 44.9231, 3, 'Low', '2025-04-04T00:00:00.000Z'::timestamp),
  ('SSD15057', 'South Sudan', 7.7441, 29.0868, 6, 'Medium', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SSD15058', 'South Sudan', 9.3987, 28.8234, 4, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SSD15059', 'South Sudan', 8.1887, 28.7391, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SSD15060', 'South Sudan', 8.1779, 28.6468, 1, 'Low', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SUD34565', 'Sudan', 17.5588, 27.0944, 10, 'Medium', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SUD34589', 'Sudan', 12.0556, 24.8906, 1, 'Low', '2025-04-03T00:00:00.000Z'::timestamp),
  ('SUD34594', 'Sudan', 15.3629, 32.5289, 90, 'High', '2025-04-01T00:00:00.000Z'::timestamp),
  ('SUD34595', 'Sudan', 15.5616, 32.5841, 3, 'Low', '2025-04-02T00:00:00.000Z'::timestamp)
),
inserted_locations as (
  insert into locations (place, latitude, longitude)
  select distinct place, latitude, longitude
  from batch_data
  on conflict (place, latitude, longitude) do nothing
  returning id, place, latitude, longitude
),
all_locations as (
  select id, place, latitude, longitude from inserted_locations
  union
  select l.id, l.place, l.latitude, l.longitude
  from locations l
  join batch_data b
    on b.place = l.place
   and b.latitude = l.latitude
   and b.longitude = l.longitude
)
insert into disaster_events (
  event_id,
  event_type_id,
  location_id,
  magnitude,
  severity,
  event_time,
  source_type,
  is_deleted
)
select
  b.event_id,
  et.id,
  al.id,
  b.magnitude,
  b.severity,
  b.event_time,
  'external',
  false
from batch_data b
join event_types et on et.name = 'conflict'
join all_locations al
  on al.place = b.place
 and al.latitude = b.latitude
 and al.longitude = b.longitude
on conflict (event_id) do update set
  event_type_id = excluded.event_type_id,
  location_id = excluded.location_id,
  magnitude = excluded.magnitude,
  severity = excluded.severity,
  event_time = excluded.event_time,
  source_type = excluded.source_type,
  is_deleted = false,
  updated_at = now();

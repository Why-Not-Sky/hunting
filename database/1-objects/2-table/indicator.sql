--DROP TABLE indicator;
CREATE TABLE indicator2
(
   symbol_id   varchar (10),
   idc_date    date,
   idc_type    varchar (4),                                         --rsi, kd,
   period      int,                                           --5, 10, 20, ...
   cycle       char (1),                                    --d, w, m, q, h, y
   idc_value   float
);

CREATE INDEX pm_key
   ON indicator2 (symbol_id,
                  idc_date,
                  idc_type,
                  period);

CREATE TABLE indicator_definition
(
   idc_id     int,
   idc_name   varchar (12),            --rsi: 14 d/ kd: n-day/ n-week/ n-month
   idc_type   varchar (4),                                          --rsi, kd,
   period     int,                                            --5, 10, 20, ...
   cycle      char (1)                                      --d, w, m, q, h, y
);

CREATE TABLE indicator
(
   idc_id      int,
   symbol_id   varchar (10),
   idc_date    date,
   idc_value   float
);

CREATE INDEX pm_key
   ON indicator (idc_id, symbol_id, idc_date);
   
CREATE TABLE kd
(
   idc_id      int,
   symbol_id   varchar (10),
   idc_date    date,
   rsv   float,
   k float,
   d float
);   
   
CREATE INDEX idx_date
   ON kd (idc_date, idc_id,  symbol_id);
CREATE INDEX idx_symbol
   ON kd (idc_id,  symbol_id, idc_date);
      
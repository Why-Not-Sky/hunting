--select * from run_rsi('20151201', '20151204', 14, 1);

CREATE OR REPLACE FUNCTION run_rsi(from_date date, to_date date, n int, idc int) 
    RETURNS void AS $$
DECLARE run_date date := from_date;
BEGIN
    while (run_date <= to_date) loop 
        raise notice 'Calcualting (%)...', run_date;
        execute calculate_rsi (run_date, run_date, n, idc);
        run_date := run_date + 1;
    end loop;
END;
$$ LANGUAGE plpgsql;
--select * from run_rsi('20160801', '20160819', 14, 1);
--truncate table indicator

CREATE OR REPLACE FUNCTION run_rsi(from_date date, to_date date, n int, idc int) 
    RETURNS void AS $$
DECLARE run_date date := from_date;
BEGIN
    while (run_date <= to_date) loop 
        --BEGIN TRANSACTION a;
        raise notice 'Calcualting (%)...', run_date;
        --execute calculate_rsi2 (run_date, run_date, n, idc);
        perform calculate_rsi2 (run_date, run_date, n, idc);
        --select * from calculate_rsi2 (run_date, run_date, n, idc);
        run_date := run_date + 1;
        --COMMIT TRANSACTION a;
    end loop;
END;
$$ LANGUAGE plpgsql;
--select * from calculate_rsi('20160701', '20160731', 14);
--select * from indicator where idc_id = 1 and idc_date >= '20160101' order by symbol_id, idc_date desc;

CREATE OR REPLACE FUNCTION calculate_rsi(from_date date, to_date date, n int) 
    RETURNS void AS $$
DECLARE start_date date := from_date - n;
BEGIN
      
      with rsi_rank as (
    		select symbol_id, trade_date, row_number() over (partition by symbol_id order by trade_date desc) as rnum
    			  , close
    			  , (case when change >0 then change else 0 end) as up
    			  , (case when change < 0 then -1 * change else 0 end) as down
    		 from quotes
    		 where trade_date between start_date and to_date  -- >= '20160101'
    		 --and symbol_id in ('0050', '2329')
    		 order by symbol_id, trade_date desc ),
 	    rsi_data as (
    		 select m.symbol_id, m.trade_date, s.close, m.rnum as m_num, s.trade_date as s_date, s.rnum as s_num
    			  , (s.rnum-m.rnum) as diff
    			  , (s.up) as up
    			  , (s.down) as down
    		 from rsi_rank m
    			  join rsi_rank s on (m.symbol_id = s.symbol_id and (s.rnum - m.rnum) between 0 and n)
    		where m.trade_date between from_date and to_date    --return only the calculate range
    		order by m.symbol_id, m.trade_date desc, s.trade_date desc)

    insert into indicator (idc_id, symbol_id, idc_date, idc_value)
    select  1 as idc_id, symbol_id, trade_date
              --, (case when down=0 then 999999 else up/down end) as rs
          	  , (case when down=0 then 100 else 100 - 100/(1.0 + up/down) end) as rsi
          from (
        		 select m.symbol_id, m.trade_date, count(*) as cnt
        			  , avg(up) as up
        			  , avg(down) as down
        		 from rsi_data m
        		group by m.symbol_id, m.trade_date) as rsi
        order by 1, 2 desc;
    END;
    $$ LANGUAGE plpgsql;
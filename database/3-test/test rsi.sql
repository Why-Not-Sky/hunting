      --delete from indicator where idc_id = 1 and idc_date between from_date and to_date;
      with rsi_rank as (
    		select symbol_id, trade_date, row_number() over (partition by symbol_id order by trade_date desc) as rnum
    			  , close
    			  , (case when change > 0 then change else 0 end) as gain
    			  , (case when change < 0 then -1 * change else 0 end) as loss
    		 from quotes
    		 where trade_date between '20160701' and '20160819'  -- >= '20160101'
    		  and symbol_id in ('0050', '2329')
    		 order by symbol_id, trade_date desc ),

--select * from rsi_rank order by 1, 2 desc;

 	    rsi_data as (
    		 select m.symbol_id, m.trade_date, s.close, m.rnum as m_num, s.trade_date as s_date, s.rnum as s_num
    			  , (s.rnum-m.rnum) as diff
    			  , (s.gain) as gain
    			  , (s.loss) as loss
    		 from rsi_rank m
    			  join rsi_rank s on (m.symbol_id = s.symbol_id and (s.rnum - m.rnum) between 0 and 13)
    		where m.trade_date between '20160801' and '20160819'     --return only the calculate range
    		order by m.symbol_id, m.trade_date desc, s.trade_date desc)

--select * from rsi_data order by 1, 2 desc, s_date desc;

    select  symbol_id, trade_date, gain, loss, rs
          	  , (case when (gain+loss)=0 then 50 else 100 * gain/(gain+loss) end) as rsi
          from (
        		 select m.symbol_id, m.trade_date, count(*) as cnt
        			  , avg(gain) as gain
        			  , avg(loss) as loss
        			  , (case when avg(loss)=0 then 999999 else  avg(gain) /avg(loss) end) as rs
        		 from rsi_data m
        		group by m.symbol_id, m.trade_date) as rsi
        order by 1, 2 desc;


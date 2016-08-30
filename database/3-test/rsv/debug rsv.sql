with periods as (
        select s.trade_date as from_date, m.trade_date as to_date
		  from opendate m
			  join opendate s on ((m.rno - s.rno) = (9-1))
		where m.trade_date between '20160801' and '20160819'),   

     rsv_d as (
		 select symbol_id, m.to_date as trade_date, count(*) as cnt   --s.close, s.trade_date as s_date
		 	  , max(case when m.to_date=s.trade_date then close else 0 end) as close
			  , max(high) as highest
			  , min(low) as lowest
		 from periods m
			  join quotes s on (s.trade_date between m.from_date and m.to_date)   --performance for only the calculate range,
		where s.trade_date between '20160701' and '20160819'
		  and s.symbol_id in ('0050', '2329')
		group by symbol_id, m.to_date),
	
	 rsv_n as (
    	select m.symbol_id, m.trade_date
    	      , cnt, close, highest, lowest
			  , (case when highest=lowest then 100 else  (close-lowest)/(highest-lowest) end) as rsv
		 from rsv_d m)
		 
	select * from rsv_n order by 1, 2 desc
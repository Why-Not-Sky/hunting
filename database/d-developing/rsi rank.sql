--https://www.postgresql.org/docs/8.4/static/queries-with.html
with rsi_rank as (
		select symbol_id, trade_date, row_number() over (partition by symbol_id order by trade_date desc) as rnum
			  , close
			  , (case when change >0 then change else 0 end) as up
			  , (case when change < 0 then -1 * change else 0 end) as down
		 from quotes
		 where trade_date >= '20160701'
		 and symbol_id in ('0050', '2329')
		 order by symbol_id, trade_date desc ),
 	rsi_data as (
		 select m.symbol_id, m.trade_date, s.close, m.rnum as m_num, s.trade_date as s_date, s.rnum as s_num
			  , (s.rnum-m.rnum) as diff
			  , (s.up) as up
			  , (s.down) as down
		 from rsi_rank m
			  join rsi_rank s on (m.symbol_id = s.symbol_id and (s.rnum - m.rnum) between 0 and 13)
		order by m.symbol_id, m.trade_date desc, s.trade_date desc)

 select * from rsi_data 
 order by symbol_id, trade_date desc, s_date desc;
 
 select m.symbol_id, m.trade_date, count(*) as cnt
      , avg(up) as up
      , avg(down) as down
 from rsi_data m
group by m.symbol_id, m.trade_date
order by 1, 2 desc;
 
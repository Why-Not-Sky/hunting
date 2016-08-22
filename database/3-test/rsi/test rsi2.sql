with periods as (
        select s.trade_date as from_date, m.trade_date as to_date
		  from opendate m
			  join opendate s on ((m.rno - s.rno) = (14-1))
		where m.trade_date between '20160819' and '20160819'),   

     rsi_data as (
		 select symbol_id, m.to_date as trade_date, count(*) as cnt   --s.close, s.trade_date as s_date
			  , avg(case when change >0 then change else 0 end) as gain
			  , avg (case when change < 0 then -1 * change else 0 end) as loss
		 from periods m
			  join quotes s on (s.trade_date between m.from_date and m.to_date)   --performance for only the calculate range,
		where s.trade_date between '20160719' and '20160819'
		group by symbol_id, m.to_date),
	
	 rsi_n as (
    	select m.symbol_id, m.trade_date, cnt
			  , gain, loss
			  , (case when loss=0 then 999999 else  gain/loss end) as rs
          	  , (case when (gain+loss)=0 then 50 else 100 * gain/(gain+loss) end) as rsi
		 from rsi_data m)

select * from rsi_data order by 1, 2 desc;
select * from rsi_data;
select * from ris_n
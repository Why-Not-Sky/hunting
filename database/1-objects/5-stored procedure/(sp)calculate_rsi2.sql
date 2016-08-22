--select * from calculate_rsi('20160819', '20160819', 14, 1);
--select * from indicator where idc_id = 1 and idc_date between '20160819' and '20160819' order by symbol_id, idc_date desc;
------------------------------------------------------------------------------------------------------
--http://www.cmoney.tw/notes/note-detail.aspx?nid=6162
--http://ntd2u.net/thread-3690-1-1.html
--http://journal.eyeprophet.com/%E6%95%99%E4%BD%A0%E7%9C%8B%E6%87%82-rsi-%E7%9B%B8%E5%B0%8D%E5%BC%B7%E5%BC%B1%E6%8C%87%E6%A8%99/
--http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:relative_strength_index_rsi
--1.RSI大於80時，為超買訊號，市場過熱，要準備開始跌了。
--2.RSI小於20時，為超賣訊號，市場過冷，要準備開始漲了。
--3.黃金交叉時可以買進；死亡交叉時可以賣出。
--DROP FUNCTION calculate_rsi2(from_date date, to_date date, n int, idc int) 
------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_rsi2(begin_date date, end_date date, n int, idc int) 
    RETURNS void AS $$
DECLARE start_date date := begin_date - n - 16;  --wide range to filtered the data
BEGIN

    delete from indicator where idc_id = idc and idc_date between begin_date and end_date;
      
    with periods as (
            select m.trade_date as from_date, s.trade_date as to_date
    		  from opendate m
    			  join opendate s on ((m.rno - s.rno) = (n-1))
    		where m.trade_date between begin_date and end_date),   
    
         rsi_data as (
    		 select symbol_id, m.from_date as trade_date, count(*) as cnt   --s.close, s.trade_date as s_date
    			  , avg(case when change >0 then change else 0 end) as gain
    			  , avg (case when change < 0 then -1 * change else 0 end) as loss
    		 from periods m
    			  join quotes s on (s.trade_date between m.from_date and m.to_date)   --performance for only the calculate range,
    		where s.trade_date between start_date and end_date
    		group by symbol_id, m.from_date),
    	
    	 rsi_n as (
        	select m.symbol_id, m.trade_date, cnt
    			  , gain, loss
    			  , (case when loss=0 then 999999 else  gain/loss end) as rs
              	  , (case when (gain+loss)=0 then 50 else 100 * gain/(gain+loss) end) as rsi
    		 from rsi_data m)
    		

    insert into indicator (idc_id, symbol_id, idc_date, idc_value)
    select  idc as idc_id, symbol_id, trade_date, rsi
      from rsi_n 
     order by 1, 2 desc;
    
    END;
    $$ LANGUAGE plpgsql;
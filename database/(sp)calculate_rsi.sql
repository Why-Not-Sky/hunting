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
--DROP FUNCTION calculate_rsi(from_date date, to_date date, n int) 
------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_rsi(from_date date, to_date date, n int, idc int) 
    RETURNS void AS $$
DECLARE start_date date := from_date - n - 10;  --get wide range of data 
BEGIN
      delete from indicator where idc_id = idc and idc_date between from_date and to_date;
      --delete from rsi_detail where idc_id = idc and idc_date between from_date and to_date;
      
      with rsi_rank as (
    		select symbol_id, trade_date, row_number() over (partition by symbol_id order by trade_date desc) as rnum
    			  , close, change
    			  , (case when change >0 then change else 0 end) as gain
    			  , (case when change < 0 then -1 * change else 0 end) as loss
    		 from quotes
    		 where trade_date between start_date and to_date  -- >= '20160101'
    		 --and symbol_id in ('0050', '2329')
    		 order by symbol_id, trade_date desc ),
 	    rsi_data as (
    		 select m.symbol_id, m.trade_date
    		      --, m.rnum as m_num, s.trade_date as s_date, s.rnum as s_num, (s.rnum-m.rnum) as diff, s.close, s.change
    			  , (s.gain) as gain
    			  , (s.loss) as loss
    		 from rsi_rank m
    			  join rsi_rank s on (m.symbol_id = s.symbol_id and (s.rnum - m.rnum) between 0 and (n-1))
    		where m.trade_date between from_date and to_date    --performance: return only the calculate range
    		order by m.symbol_id, m.trade_date desc, s.trade_date desc)

    --insert into rsi_data (idc_id, symbol_id, idc_date,  m_num, s_date, s_num, diff, close, change, gain, loss)
    --select 1 as idc, symbol_id, trade_date,  m_num, s_date, s_num, diff, close, change, gain, loss from rsi_data;
    
    insert into indicator (idc_id, symbol_id, idc_date, idc_value)
    --insert into rsi_detail (idc_id, symbol_id, idc_date,  gain, loss, period, rs, rsi)
    select  idc as idc_id, symbol_id, trade_date--, gain, loss, cnt, rs
          	  , (case when (gain+loss)=0 then 50 else 100 * gain/(gain+loss) end) as rsi
          from (
        		 select m.symbol_id, m.trade_date, count(*) as cnt
        			  , avg(gain) as gain
        			  , avg(loss) as loss
        			  , (case when avg(loss)=0 then 999999 else  avg(gain) /avg(loss) end) as rs
        		 from rsi_data m
        		group by m.symbol_id, m.trade_date) as rsi
        order by 1, 2 desc;
    
    END;
    $$ LANGUAGE plpgsql;
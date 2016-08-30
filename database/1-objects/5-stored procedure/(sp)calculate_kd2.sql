select * from calculate_kd2('20160801', '20160819', 9, 11);
select * from indicator where idc_id = 11  and symbol_id in ('0050') and idc_date between '20160801' and '20160819' order by symbol_id, idc_date desc;
/********************************************************************************************
--http://www.ezchart.com.tw/inds.php?IND=KD
說明	KD市場常使用的一套技術分析工具。其適用範圍以中短期投資的技術分析為最佳。
隨機 指標的理論認為：當股市處於牛市時，收盤價往往接近當日最高價； 反之在熊市時，收盤價比較接近當日最低價，該指數的目的即在反映 出近期收盤價在該段日子中價格區間的相對位置。
計算公式	
它是由%K(快速平均值)、%D(慢速平均值)兩條線所組成，假設從n天週期計算出隨機指標時，首先須找出最近n天當中曾經出現過的最高價、最低價與第n天的收盤價，然後利用這三個數字來計算第n天的未成熟隨機值(RSV)
         第n天收盤價-最近n天內最低價
RSV ＝──────────────────────────────────×100
      最近n天內最高價-最近n天內最低價
計算出RSV之後，再來計算K值與D值。
當日K值(%K)= 2/3 前一日 K值 + 1/3 RSV
當日D值(%D)= 2/3 前一日 D值＋ 1/3 當日K值
若無前一日的K值與D值，可以分別用50來代入計算，經過長期的平滑的結果，起算基期雖然不同，但會趨於一致，差異很小。
*********************************************************************************************/
--DROP FUNCTION calculate_kd2(from_date date, to_date date, n int, idc int) 
------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_kd2(begin_date date, end_date date, n int, idc int) 
    RETURNS void AS $$
DECLARE start_date date := begin_date - n - 16;  --wide range to filtered the data
BEGIN

    raise notice 'Calcualting (% ~ %)...', start_date, end_date;
    delete from indicator where idc_id = idc and idc_date between begin_date and end_date;
    --delete from rsv_data; --where idc_id = idc and idc_date between begin_date and end_date;
    
    -- need to check the from_date and to_date...  
    with periods as (
            select s.trade_date as from_date, m.trade_date as to_date
    		  from opendate m
    			  join opendate s on ((m.rno - s.rno) = (n-1))
    		where m.trade_date between begin_date and end_date),   
    
         rsv_d as (
    		 select symbol_id, m.to_date as trade_date, count(*) as cnt   --s.close, s.trade_date as s_date
    		 	  , max(case when m.to_date=s.trade_date then close else 0 end) as close
    			  , max(high) as highest
    			  , min(low) as lowest
    		 from periods m
    			  join quotes s on (s.trade_date between m.from_date and m.to_date)   --performance for only the calculate range,
    		where s.trade_date between start_date and end_date
    		group by symbol_id, m.to_date),
    	
    	 rsv_n as (
        	select m.symbol_id, m.trade_date
        	      , cnt, close, highest, lowest
    			  , (case when highest=lowest then 100 else  100*(close-lowest)/(highest-lowest) end) as rsv
    		 from rsv_d m)

    --insert into rsv_data (idc_id, symbol_id, idc_date, gain, loss)
    --select 1 as idc, symbol_id, trade_date, gain, loss from r_data;
        		
    insert into indicator (idc_id, symbol_id, idc_date, idc_value)
    select idc as idc_id, symbol_id, trade_date, rsv
      from rsv_n 
     order by 1, 2 desc;

    END;
    $$ LANGUAGE plpgsql;
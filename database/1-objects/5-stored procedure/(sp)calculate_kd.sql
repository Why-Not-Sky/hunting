select * from calculate_kd('20160801', '20160819', 9);
--select * from indicator where idc_id = 11 and idc_date >= '20160101' order by symbol_id, idc_date desc;

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

CREATE OR REPLACE FUNCTION calculate_kd(begin_date date, end_date date, rsv_id int, k_id int, d_id int) 
    RETURNS void AS $$
DECLARE start_date date := begin_date - 10;   --avoid holidays
BEGIN
    raise notice 'Calcualting (% ~ %)...', start_date, end_date;
    delete from indicator where idc_id = idc and idc_date between begin_date and end_date;
      --delete from rsv_data; --where idc_id = idc and idc_date between begin_date and end_date;
    
    with k_rank as (
    		select symbol_id, idc_date , row_number() over (partition by symbol_id order by trade_date desc) as rnum
    			  ,  (idc_value) as k
    		 from indicator
    		 where idc_id = k_id
    		   and idc_date between start_date and end_date  -- >= '20160101'
    		 --and symbol_id in ('0050', '2329')
    		 order by symbol_id, trade_date desc ),
    	k_data as (
    		 select m.symbol_id, m.trade_date, m.idc_value as k,  s.idc_value as k_1
    		      --, m.rnum as m_num, s.trade_date as s_date, s.rnum as s_num, (s.rnum-m.rnum) as diff, s.close, s.change
    		 from k_rank m
    			  join k_rank s on (m.symbol_id = s.symbol_id and (s.rnum - m.rnum) = 1)
    		order by m.symbol_id, m.trade_date desc)
 
    		 
    	d_rank as (
    		select symbol_id, idc_date , row_number() over (partition by symbol_id order by trade_date desc) as rnum
    			  ,  (idc_value) as d
    		 from indicator
    		 where idc_id = d_id
    		   and idc_date between start_date and end_date  -- >= '20160101'
    		 --and symbol_id in ('0050', '2329')
    		 order by symbol_id, trade_date desc ),	 
   		d_data as (
    		 select m.symbol_id, m.trade_date, m.idc_value as k,  s.idc_value as k_1    		      
    		 from k_rank m
    			  join k_rank s on (m.symbol_id = s.symbol_id and (s.rnum - m.rnum) = 1)
    		order by m.symbol_id, m.trade_date desc)
 

    	rsv_data as (
    		select symbol_id, idc_date , row_number() over (partition by symbol_id order by trade_date desc) as rnum
    			  ,  (idc_value) as rsv
    		 from indicator
    		 where idc_id = rsv_id
    		   and idc_date between begin_date and end_date  -- >= '20160101'
    		 --and symbol_id in ('0050', '2329')
    		 order by symbol_id, trade_date desc ),	 
    		 
 	    kd_data as (
    		 select m.symbol_id, m.idc_date as trade_date, rsv
    		 	   , k 
    		 	   ,(d * 2/3 + k * 1/3) as d
    		   from (
    		 		select m.symbol_id, m.idc_date as trade_date, m.rsv
    			  		  , (k * 2/3 + rsv * 1/3) as k    			  
    		 		  from rsv_data m
    			           join k_rank k on (m.symbol_id = k.symbol_id and (s.rnum - m.rnum) = 1)
    			    ) rd
    			    join d_rank d on ((rd.symbol_id = d.symbol_id and (s.rnum - m.rnum) = 1)
    		where m.trade_date between begin_date and end_date    --return only the calculate range
    		order by m.symbol_id, m.trade_date desc, s.trade_date desc)

    insert into indicator (idc_id, symbol_id, idc_date, idc_value)
    select  11 as idc_id, symbol_id, trade_date
              , 100 * (close-lowest)/(highest-lowest) as rsv
          from (
        		 select m.symbol_id, m.trade_date, count(*) as cnt
        			  , close
        			  , min(low) as lowest
        			  , max(high) as highest
        		 from kd_data m
        		group by m.symbol_id, m.trade_date) as rsv
        order by 1, 2 desc;
    END;
    $$ LANGUAGE plpgsql;
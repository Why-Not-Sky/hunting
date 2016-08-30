--rsi: 14, 28
--insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (1, 'rsv:9日', 'rsi', 9, 'd');
--insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (2, 'rsi:28日', 'rsi', 28, 'd');
select * from calculate_rsv2('20160801', '20160819', 9, 11);

select symbol_id, trade_date, close, high, low, open, change
from quotes 
where symbol_id = '0050' and trade_date >= '20160701' 
order by trade_date desc;

select * from indicator 
where idc_id = 11 and symbol_id= '0050' 
and idc_date between '20160801' and '20160819' order by symbol_id, idc_date desc;







--rsi: 14, 28
--insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (1, 'rsi:14日', 'rsi', 14, 'd');
--insert into indicator_definition(idc_id, idc_name, idc_type, period, cycle) values (2, 'rsi:28日', 'rsi', 28, 'd');
select * from calculate_rsi('20070701', '20160130', 14, 1);
select * from calculate_rsi('20070701', '20160130', 28, 2);

select symbol_id, trade_date
	  , (case when change >0 then change else 0 end) as gain
	  , (case when change < 0 then -1 * change else 0 end) as loss
from quotes 
where symbol_id = '0050' and trade_date >= '20160701' 
order by trade_date desc;

--1500,996 ms
select * from calculate_rsi('20160801', '20160819', 14, 1);
drop table rsi_20160819;
select * into rsi_20160819 from indicator where idc_id = 1 and symbol_id= '0050' and idc_date between '20160801' and '20160819' order by symbol_id, idc_date desc;

--select * from indicator where idc_id = 1 and idc_date between '20160819' and '20160819' and symbol_id= '0050' order by symbol_id, idc_date desc;
--select * from rsi_data where idc_id = 1 and idc_date between '20160819' and '20160819' and symbol_id= '0050' order by symbol_id, idc_date desc;
--select * from rsi_detail where idc_id = 1 and idc_date between '20160819' and '20160819' and symbol_id= '0050' order by symbol_id, idc_date desc;

--973.075 ms
select * from calculate_rsi2('20160801', '20160819', 14, 1);
drop table rsi2_20160819;
select * into rsi2_20160819 from indicator where idc_id = 1 and symbol_id= '0050' and idc_date between '20160801' and '20160819' order by symbol_id, idc_date desc;

select * from rsi_20160819 where symbol_id <= '0050' order by symbol_id;
select * from rsi2_20160819 where symbol_id <= '0050' order by symbol_id;






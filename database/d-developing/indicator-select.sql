select * from calculate_rsi('20160730', '20160819', 14);

select * from indicator where idc_id = 1 and idc_date >= '20160101' order by symbol_id, idc_date desc;

select max(idc_date) from indicator where idc_id = 1 and symbol_id = '0050';

select count(*) from indicator where idc_id = 1 and idc_date = '20160819';
select count(*) from quotes where trade_date = '20160819';
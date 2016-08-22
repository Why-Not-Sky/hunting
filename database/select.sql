select * from symbol;
--truncate table symbol;
select * from quotes where trade_date = '20160812';

select trade_date, count(*) from quotes group by trade_date order by 1;
select min(trade_date), max(trade_date)  from quotes;

create index idx_symobl on quotes (symbol_id, trade_date);
create index idx_trade_date on quotes (trade_date, symbol_id);

--find the trade_date that don't have negative number
select distinct trade_date from quotes qu
where not exists( select distinct trade_date from quotes mi where change < 0 and qu.trade_date=mi.trade_date);

select count(*) from quotes;

select count(*) from symbol;
select * from quotes where length(symbol_id) != 4
delete from indicator where length(symbol_id) != 4


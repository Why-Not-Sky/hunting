select * from symbol;
select * from quotes where trade_date = '20160801';

select trade_date, count(*) from quotes group by trade_date order by 1;
select min(trade_date), max(trade_date)  from quotes;

--find the trade_date that don't have negative number
select distinct trade_date from quotes qu
where not exists( select distinct trade_date from quotes mi where change < 0 and qu.trade_date=mi.trade_date);


seaEye


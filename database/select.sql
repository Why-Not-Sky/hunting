select * from symbol;
select * from quotes;
select trade_date, count(*) from quotes group by trade_date order by 1;
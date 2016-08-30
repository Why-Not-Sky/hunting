select count(*) from quotes_20070423_20060819;

select min(trade_date), max(trade_date) from quotes;
select * into quotes_20070423_20060819 from quotes;

select * from quotes where trade_date < '20060101';
delete from quotes where trade_date < '20060101';
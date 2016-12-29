select min(trade_date), max(trade_date) from quotes 
where trade_date between '20160101' and '20161231';

--list number of records by year.
select extract(year from trade_date) as years, count(*)
from quotes
group by extract(year from trade_date)
order by 1;


select min(trade_date), max(trade_date) from quotes;

select trade_date, count(*) from quotes 
group by trade_date
having count(*) < 800

where trade_date between '20000101' and '20001231';


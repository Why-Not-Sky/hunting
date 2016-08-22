select min(trade_date), max(trade_date) from quotes 
where trade_date between '20000101' and '20001231';

select min(trade_date), max(trade_date) from quotes;

select min(trade_date), max(trade_date) from quotes;

select trade_date, count(*) from quotes 
group by trade_date
having count(*) < 800

where trade_date between '20000101' and '20001231';


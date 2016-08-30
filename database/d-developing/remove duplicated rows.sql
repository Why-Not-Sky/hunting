select min(trade_date), max(trade_date), count(*) from quotes;

select extract(year from trade_date) as years, count(*)
from quotes
group by extract(year from trade_date)
order by 1;

--save the date and the data
select distinct trade_date
into dup_rows
from (
select trade_date, symbol_id, count(*)
 from quotes
group by trade_date, symbol_id
having count(*) > 1) as y;

select distinct * 
into rm_dup_rows
from quotes
where trade_date in (select trade_date from dup_rows) 
order by 1, 2 ;

--verify
select distinct trade_date
from (
select trade_date, symbol_id, count(*)
 from rm_dup_rows
group by trade_date, symbol_id
having count(*) > 1) as y;

--delete 
delete from quotes where trade_date in (select trade_date from dup_rows) ;
insert into quotes select * from rm_dup_rows;

--verify again
select distinct trade_date
from (
select trade_date, symbol_id, count(*)
 from quotes
group by trade_date, symbol_id
having count(*) > 1) as y;
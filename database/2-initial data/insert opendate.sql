insert into opendate(trade_date, weekday, weeks, months, years)
select trade_date, extract(dow from trade_date), extract(week from trade_date), extract(month from trade_date), extract(year from trade_date)
from (select distinct trade_date from quotes) as q
order by trade_date

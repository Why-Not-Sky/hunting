select * from revenue where rev_year= 2016 and rev_month = 6
select rev_year, rev_month, count(*) from revenue group by rev_year, rev_month order by 1, 2

--truncate table revenue

create index idx_month on revenue (rev_year, rev_month, symbol_id);
create index idx_symbol on revenue (symbol_id, rev_year, rev_month)




with periods as (
            select m.trade_date as from_date, s.trade_date as to_date
                  , m.rno as mno, s.rno as sno
    			  , (m.rno-s.rno) as diff
    		 from opendate m
    			  join opendate s on ((m.rno - s.rno) between 0 and 13)
    		--where m.trade_date between from_date and to_date    --return only the calculate range
    		order by m.trade_date desc, s.trade_date desc)

select * from periods order by from_date desc, to_date desc;

with periods as (
            select m.trade_date as from_date, s.trade_date as to_date
    			  , (m.rno-s.rno) as diff
    		 from opendate m
    			  join opendate s on ((m.rno - s.rno) = 13)
    		--where m.trade_date between from_date and to_date    --return only the calculate range
    		order by m.trade_date desc, s.trade_date desc)
    		
select * from periods order by from_date desc, to_date desc;

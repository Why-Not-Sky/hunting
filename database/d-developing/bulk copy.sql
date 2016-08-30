--no HEADER
COPY quotes FROM '/Users/sky_wu/Dropbox/myprojects/hunting/database/3-test/1.csv' DELIMITER ',' CSV;
--with Header
COPY quotes FROM '/Users/sky_wu/Dropbox/myprojects/hunting/database/3-test/2.csv' DELIMITER ',' CSV HEADER;
COPY quotes FROM '/Users/sky_wu/Dropbox/myprojects/hunting/database/3-test/3.csv' DELIMITER ',' CSV HEADER;
COPY quotes FROM '/Users/sky_wu/Dropbox/myprojects/hunting/database/3-test/4.csv' DELIMITER ',' CSV HEADER;

--select * from quotes where trade_date < '20060101';
delete from quotes where trade_date <= '19971231';
COPY quotes FROM '/Users/sky_wu/workspace/marbo/marbo-1987-1997.csv' DELIMITER ',' CSV HEADER;
select count(*) from quotes where trade_date <= '19971231';

delete from quotes where trade_date between '19980101' and '20021231';
COPY quotes FROM '/Users/sky_wu/workspace/marbo/marbo-1998-2002.csv' DELIMITER ',' CSV HEADER;
select count(*) from quotes where trade_date between '19980101' and '20021231';

delete from quotes where trade_date between '20030101' and '20071231';
COPY quotes FROM '/Users/sky_wu/workspace/marbo/marbo-2003-2007.csv' DELIMITER ',' CSV HEADER;
select count(*) from quotes where trade_date between '20030101' and '20071231';



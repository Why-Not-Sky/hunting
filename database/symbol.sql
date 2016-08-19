create table type
(
  type_id	char(1),   --T:上市 O:上櫃
  type_name varchar(12)
);

------------------------------------------------------------------
-- truncate table symbol;
------------------------------------------------------------------

CREATE TABLE symbol
(
   symbol_id     varchar  (10),
   symbol_name   varchar  (20),
   symbol_type	 char(1),
   industry_code varchar(8),
   on_market		date
);

-- if we like to log the merge and acquire hisotry
create table profile
(
  company_no	 int,
  english_name varchar(128),
  chinese_name varchar(32),
  location_id	int,		--縣市區域：附近的券商
  capital		bigint,
  symbol_id varchar(10)
);

create table industry
(
  industry_code	 varchar(8),
  industry_name varchar(128)
);


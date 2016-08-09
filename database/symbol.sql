create table type
(
  type_id	char(1),   --T:上市 O:上櫃
  type_name varchar(12)
);

------------------------------------------------------------------
--  TABLE symbol
------------------------------------------------------------------

CREATE TABLE symbol
(
   symbol_id     VCHARACTER  (10),
   symbol_name   VCHARACTER  (20),
   symbol_type	 char(1)
);

-- if we like to log the merge and acquire hisotry
create table profile
(
  company_no	 int,
  english_name varchar(128),
  chinese_name vharchar(32),
  location_id	int,		--縣市區域：附近的券商
  capital		bigint,
  symbol_id varchar(10)
);

create table category
(
  category_no int,
  category_name varchar(32),
  parent_category int
);

create table classification
(
  category_no int,
  symbol_id VCHARACTER (10)
  );
 
 --how to extend if we like to show tag colud (total count for each tag)
 create table tag
 (
   tag_no int,
   tag_name varchar(16)
 );
 
 create table tagging
 (
   tag_no int,
   symbol_id VCHARACTER (10)
 )
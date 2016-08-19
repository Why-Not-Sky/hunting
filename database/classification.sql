create table category
(
  category_no int,
  category_name varchar(32),
  parent_category int
);

create table classification
(
  category_no int,
  symbol_id varchar (10)
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
   symbol_id varchar (10)
 );
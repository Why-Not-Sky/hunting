CREATE TABLE stkid
(
   stockid     varchar (10) NULL,
   stkname     varchar (20) NULL,
   cl          varchar (50) NULL,
   minbw_dte   date NULL,
   minbw       float NULL,
   sqdays      smallint NULL,
   price       float NULL,
   dte         date NULL,
   rmk         varchar (255) NULL,
   web         varchar (100) NULL,
   model       varchar (50) NULL,
   flgbasic    varchar (1) NULL
);

--create pmimary key pm_key on stkid(stockid);

--drop table stkid;
select * from stkid;
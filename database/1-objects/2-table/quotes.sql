DROP TABLE quotes;
--quotes / historical price

CREATE TABLE quotes
(
   symbol_id    varchar (10) NULL,                                        --股號
   trade_date   date NULL,                                              --成交日期
   volume       float NULL,                             --成交量 (Trading Volume)
   amount       float NULL,                         --成交金額 (TurnOver in value)
   open         float NULL,                                              --開盤價
   high         float NULL,                                              --最高價
   low          float NULL,                                              --最低價
   close        float NULL,                                              --收盤價
   change       float NULL,                                             --漲跌價差
   trans        float NULL,                     --成交筆數 (Number of Transactions)
   frequency		char (1) NULL		--報價頻率 5min/ hour/ day/ week/ month/ ....
);

create index idx_symobl on quotes (symbol_id, trade_date);

--拆表格與否？frequency: N + Period 
--由row及column之間的互動關係決定 (日週月，各類指標...)
------------------------------------------------------------------
-- CREATE SEQUENCE rno;
-- ALTER TABLE opendate ALTER rno SET DEFAULT NEXTVAL('rno');
------------------------------------------------------------------
--DROP TABLE opendate;
CREATE TABLE opendate
(
   trade_date    date,
   weekday		int null,
   weeks			 int null,  --週線
   months		 int null,  --月線
   years		   	int null	,--年線
   rno			SERIAL
);

create index idx_date on opendate (trade_date, years);

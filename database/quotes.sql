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
   trans        float NULL                     --成交筆數 (Number of Transactions)
)
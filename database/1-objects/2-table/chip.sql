DROP TABLE institution_trading;
CREATE TABLE institution_trading
(
   symbol_id                    varchar (10) NULL,                      --公司代號
   trade_date                   date NULL,                                 --日
   foregin_purchase             float NULL,                          --外資買（每股）
   foregin_sale                 float NULL,                              --外資賣
   foregin_net_purchase         float NULL,                             --外資淨買
   sic_purchase                 float NULL,                              --法人買
   sic_sale                     float NULL,                              --法人賣
   sic_net_purchase             float NULL,                            --法人淨買超
   dealers_net_purchase         float NULL,                           --自營商淨買超
   dealers_prop_purchase        float NULL,                       --自營商(自行買賣)買
   dealers_prop_sale            float NULL,                       --自營商(自行買賣)賣
   dealers_prop_net_purchase    float NULL,                                 --
   dealers_hedge_purchase       float NULL,                         --自營商(避險)買
   dealers_hedge_sale           float NULL,                                 --
   dealers_hedge_net_purchase   float NULL,                                 --
   total_net_purchase           float NULL                           --三大法人買賣超
);

CREATE INDEX institution_idx_date
   ON institution_trading (trade_date, symbol_id);

CREATE INDEX institution_idx_symbol
   ON institution_trading (symbol_id, trade_date);
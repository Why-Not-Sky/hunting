DROP TABLE revenue;

CREATE TABLE revenue
(
   symbol_id                 varchar (10) NULL,                         --公司代號
   rev_year                  int NULL,                                    --月份
   rev_month                 int NULL,                                    --月份
   revenue                   float NULL,                                --當月營收
   last_month                float NULL,                                --上月營收
   last_year                 float NULL,                              --去年當月營收
   to_last_month             float NULL,                           --上月比較增減(%)
   to_last_year              float NULL,                           --去年同月增減(%)
   cumulative                float NULL,                              --當月累計營收
   cumulative_last_year      float NULL,                              --去年累計營收
   cumulative_to_last_year   float NULL,                           --前期比較增減(%)
   period                    char (1)                     --'M', 'Q', 'H', 'Y'
);

CREATE TABLE profit
(
   symbol_id          varchar (10) NULL,                                --公司代號
   years              int NULL,                                          --s年度
   season             int NULL,                                           --月份
   eps                float NULL,                                         --營收
   revenue            float NULL,                                         --營收
   profit             float NULL,                                         --獲利
   extra_income       float NULL,                                       --業外收入
   profit_after_tax   float NULL,                                       --稅後盈餘
   period             char (1)                            --'M', 'Q', 'H', 'Y'
);

create index profit_idx_date on profit (years, season, symbol_id);
create index profit_idx_symbol on profit (symbol_id, years, season);

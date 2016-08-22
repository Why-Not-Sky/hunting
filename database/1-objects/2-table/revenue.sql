drop table revenue;

CREATE TABLE revenue
(
   symbol_id                 varchar (10) NULL,                         --公司代號
   rev_year                  int NULL,                                  	  --月份
   rev_month                 int NULL,                                  	  --月份
   revenue                   float NULL,                               --當月營收
   last_month                float NULL,                               --上月營收
   last_year                 float NULL,                             --去年當月營收
   to_last_month             float NULL,                           --上月比較增減(%)
   to_last_year              float NULL,                           --去年同月增減(%)
   cumulative                float NULL,                              --當月累計營收
   cumulative_last_year      float NULL,                              --去年累計營收
   cumulative_to_last_year   float NULL,                           --前期比較增減(%)
   period                    char (1)                         --'M', 'Q', 'H', 'Y'
);
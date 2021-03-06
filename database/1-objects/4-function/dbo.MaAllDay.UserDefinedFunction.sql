USE [stock]
GO
/****** Object:  UserDefinedFunction [dbo].[MaAllDay]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[MaAllDay] 
/*=============================================
  Author:        <Edward Wang>
  Create date: <2010.8.3>
  Description:    <股票均線函數>
  Return: 該股票的 指定日期均線資料.
  Samples:
		select * from MaAllDay('1101', 6, '2013/11/21')
		select * from MaAllDay('', 6, '2013/11/21')
		select max(business_day) from stock_day where stock_code = '1101'
=============================================*/
(
    @stock_code AS varchar(10),  --股票代碼
    @ma_days AS int,							--多少天的均線
		@from_date as datetime		  --從何時開始算
)
RETURNS TABLE 
AS
RETURN

  -- 首先按照指定股票的交易日進行排序，並設定行號.
  -- 然後根據行號，進行 “簡單移動平均” 的計算
  WITH OneStockDayData(RowNum, stock_code, business_day, 
                       open_price, high_price, low_price, 
                       close_price, volume) AS
  (
  SELECT 
      row_number() OVER( ORDER BY business_day) AS RowNum
      ,stock_code
      ,business_day
      ,open_price
      ,high_price
      ,low_price
      ,close_price
      ,volume
  FROM 
    stock_day
  WHERE
    ((@stock_code='') or (stock_code = @stock_code))
		and (business_day >= dateadd(day, -2*@ma_days, @from_date))   --performance consideration.
  )
  SELECT
    a.stock_code                  AS StockCode,
    a.business_day                AS BusinessDay,
    ROUND(AVG(b.open_price), 2)   AS MaOpenPrice,
    ROUND(AVG(b.high_price), 2)   AS MaHighPrice,
    ROUND(AVG(b.low_price), 2)    AS MaLowPrice,
    ROUND(AVG(b.close_price), 2)  AS MaClosePrice,
    ROUND(AVG(b.volume), 0)       AS MaTransactNumber
  FROM
    OneStockDayData a join OneStockDayData b on (a.stock_code = b.stock_code)
  WHERE    
        a.RowNum >= @ma_days
    AND b.RowNum between (a.RowNum - @ma_days + 1) and a.RowNum
		AND a.business_day >= @from_date
  GROUP BY
    a.stock_code,
    a.business_day;

GO

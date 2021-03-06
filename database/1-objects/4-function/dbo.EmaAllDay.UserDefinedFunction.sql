USE [stock]
GO
/****** Object:  UserDefinedFunction [dbo].[EmaAllDay]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[EmaAllDay]
-- =============================================
-- Author:        <Edward Wang>
-- Create date: <2010.8.6>
-- Description:    <股票 移動指數平均 函數>
-- 第一個參數：股票代碼
-- 第二個參數：多少天的均線
-- 返回：該股票的 指定日期均線資料.
-- =============================================
(
    @StockCode AS varchar(10),
    @EmaDays AS int
)
RETURNS @ema TABLE
(
    StockCode           varchar(10) NOT NULL,
    BusinessDay         [datetime] NOT NULL,
    EmaOpenPrice        [decimal](10, 3) NOT NULL,
    EmaHighPrice        [decimal](10, 3) NOT NULL,
    EmaLowPrice         [decimal](10, 3) NOT NULL,
    EmaClosePrice       [decimal](10, 3) NOT NULL,
    EmaTransactNumber   [decimal](15, 0) NOT NULL,
    EmaTransactAmount   [decimal](20, 0) NOT NULL
)
AS
BEGIN

  DECLARE
    @KValue            AS  [decimal](10, 5),
    @EmaBusinessDay    AS  [datetime],
    @EmaOpenPrice      AS  [decimal](10, 3),
    @EmaHighPrice      AS  [decimal](10, 3),
    @EmaLowPrice       AS  [decimal](10, 3),
    @EmaClosePrice     AS  [decimal](10, 3),
    @EmaTransactNumber AS  [decimal](15, 0),
    @EmaTransactAmount AS  [decimal](20, 0),

    @BusinessDay       AS  [datetime],
    @OpenPrice         AS  [decimal](10, 3),
    @HighPrice         AS  [decimal](10, 3),
    @LowPrice          AS  [decimal](10, 3),
    @ClosePrice        AS  [decimal](10, 3),
    @TransactNumber    AS  [decimal](15, 0),
    @TransactAmount    AS  [decimal](20, 0);

  DECLARE C CURSOR FAST_FORWARD FOR
    SELECT
      business_day
      ,open_price
      ,high_price
      ,low_price
      ,close_price
      ,volume
    FROM
      stock_day
    WHERE
      stock_code = @StockCode
    ORDER BY
      business_day;


  -- 首先計算第一個 簡單移動品均值.
  SELECT
    top 1
    @EmaBusinessDay = BusinessDay,
    @EmaOpenPrice = MaOpenPrice,
    @EmaHighPrice = MaHighPrice,
    @EmaLowPrice = MaLowPrice,
    @EmaClosePrice = MaClosePrice,
    @EmaTransactNumber = MaTransactNumber
  FROM
    MaAllDay(@StockCode, @EmaDays)
  ORDER BY
    BusinessDay;

  -- 第一個 移動指數平均 =  簡單移動平均
  INSERT INTO @ema (
    StockCode,          BusinessDay,        EmaOpenPrice,
    EmaHighPrice,       EmaLowPrice,        EmaClosePrice,
    EmaTransactNumber
  ) VALUES (
    @StockCode,         @EmaBusinessDay,    @EmaOpenPrice,
    @EmaHighPrice,      @EmaLowPrice,       @EmaClosePrice,
    @EmaTransactNumber
  )

  -- 打開游標，開始計算後面的 指數移動平均
  OPEN C;

  -- 填充數據.
  FETCH NEXT FROM C INTO @BusinessDay,
        @OpenPrice,
        @HighPrice,
        @LowPrice,
        @ClosePrice,
        @TransactNumber,
        @TransactAmount;


  -- 指數移動平均 = 今天 * K +  昨天的EMA * (1-K)
  -- K = 2 / (N+1)
  -- N = EMA 天數
  -- 注意：這裡要寫 @EmaDays + 1.0， 因為 @EmaDays 為整數型， 計算結果會被取整， 1.0 使計算結果為小數.
  SET @KValue = 2 / (@EmaDays + 1.0);


  WHILE @@fetch_status = 0
  BEGIN
    IF @EmaBusinessDay < @BusinessDay
    BEGIN
      -- 當每天的資料的日期，大於 第一個 簡單移動品均 的日期後，才開始計算.

      -- 指數移動平均 = 今天 * K +  昨天的EMA * (1-K)
      SET @EmaOpenPrice = @OpenPrice * @KValue + @EmaOpenPrice * (1 - @KValue);
      SET @EmaHighPrice = @HighPrice * @KValue + @EmaHighPrice * (1 - @KValue);
      SET @EmaLowPrice = @LowPrice * @KValue + @EmaLowPrice * (1 - @KValue);
      SET @EmaClosePrice = @ClosePrice * @KValue + @EmaClosePrice * (1 - @KValue);
      SET @EmaTransactNumber = @TransactNumber * @KValue + @EmaTransactNumber * (1 - @KValue);

      -- 插入到返回資料表中.
      INSERT INTO @ema (
        StockCode,          BusinessDay,        EmaOpenPrice,
        EmaHighPrice,       EmaLowPrice,        EmaClosePrice,
        EmaTransactNumber
      ) VALUES (
        @StockCode,         @BusinessDay,       @EmaOpenPrice,
        @EmaHighPrice,      @EmaLowPrice,       @EmaClosePrice,
        @EmaTransactNumber
      )

    END

    -- 填充 下一條 數據.
    FETCH NEXT FROM C INTO @BusinessDay,
        @OpenPrice,
        @HighPrice,
        @LowPrice,
        @ClosePrice,
        @TransactNumber;
  END

  -- 關閉游標.
  CLOSE C;
  -- 釋放游標.
  DEALLOCATE C;

  RETURN;
END
 
 



GO

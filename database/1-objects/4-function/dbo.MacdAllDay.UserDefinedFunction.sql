USE [stock]
GO
/****** Object:  UserDefinedFunction [dbo].[MacdAllDay]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[MacdAllDay]
-- =============================================
-- Author:        <Edward Wang>
-- Create date: <2010.8.7>
-- Description:    <MACD 計算>
-- 第一個參數：股票代碼
-- 第二個參數：多少單位的 快線移動平均
-- 第三個參數：多少單位的 慢線移動平均
-- 第四個參數：多少單位的 移動平均
-- 返回：該股票的 MACD 資料.
-- =============================================
(
    @StockCode AS varchar(10),
    @Short     AS int,
    @Long      AS int,
    @Mid       AS int
)
RETURNS @macd TABLE
(
    StockCode           varchar(10) NOT NULL,
    BusinessDay         [datetime] NOT NULL,
    Dif                    [decimal](10, 3) NOT NULL,
    Dea                    [decimal](10, 3) NOT NULL,
    Macd                [decimal](10, 3) NOT NULL
)
AS
BEGIN

  -- 計算步驟
  -- 1. 計算收盤價的 @Short 天 EMA值。
  -- 2. 計算收盤價的 @Long 天 EMA值。
  -- 3. 用 @Short 天 EMA值 - @Long 天 EMA值 = 快速MACD線 ( DIF)
  -- 4. 計算 快速MACD線 的 @Mid 天 EMA值 = 慢速信號線 (DEA)
  -- 5. MACD 柱 = ( 快速MACD線 ( DIF) - 慢速信號線 (DEA) ) * 2

  DECLARE
    @KValue            AS  [decimal](10, 5),
    @BusinessDay        AS  [datetime],
    @Dif               AS  [decimal](10, 3),
    @TempDif           AS  [decimal](10, 3),
    @Dea               AS  [decimal](10, 3),
    @EmaIndex          AS  Int


  DECLARE C CURSOR FAST_FORWARD FOR
  SELECT
    A.BusinessDay,
    A.EmaClosePrice - B.EmaClosePrice AS  Dif
  FROM
    EmaAllDay (@StockCode, @Short) A,
    EmaAllDay (@StockCode, @Long) B
  WHERE
    A.StockCode = B.StockCode
    AND A.BusinessDay = B.BusinessDay
    AND A.StockCode = @StockCode
  ORDER BY
    A.BusinessDay;

  -- 打開游標，開始計算後面的 指數移動平均
  OPEN C;

  -- 填充數據.
  FETCH NEXT FROM C INTO @BusinessDay, @Dif;

  -- 指數移動平均 = 今天 * K +  昨天的EMA * (1-K)
  -- K = 2 / (N+1)
  -- N = EMA 天數
  -- 注意：這裡要寫 @Mid + 1.0， 因為 @Mid 為整數型， 計算結果會被取整， 1.0 使計算結果為小數.
  SET @KValue = 2 / (@Mid + 1.0);

  -- 第一個 移動指數平均 =  簡單移動平均
  -- 當該索引小於 @Mid 時，表示還需要進一步計算
  -- 當該索引等於 @Mid 時，表示使用簡單移動平均
  -- 當該索引大於 @Mid 時，表示開始使用移動指數平均
  SET @EmaIndex = 1;

  -- 用於 當該索引小於 @Mid 時， 臨時計算的 DIF.
  Set @TempDif = 0;

  WHILE @@fetch_status = 0
  BEGIN
    IF @EmaIndex < @Mid
    BEGIN
      -- 當該索引小於 @Mid 時，表示還需要進一步計算
      Set @TempDif = @TempDif + @Dif;
    END
    ELSE IF @EmaIndex = @Mid
    BEGIN
      -- 當該索引等於 @Mid 時，表示使用簡單移動平均
      Set @TempDif = @TempDif + @Dif;
      SET @Dea = @TempDif / @Mid;

      INSERT INTO @macd (
        StockCode,    BusinessDay,    Dif,
        Dea,    Macd
      ) VALUES (
        @StockCode,  @BusinessDay,   @Dif,
        @Dea,   (@Dif-@Dea) * 2
      );

    END
    ELSE
    BEGIN
      -- 當該索引大於 @Mid 時，表示開始使用移動指數平均
      -- 指數移動平均 = 今天 * K +  昨天的EMA * (1-K)
      SET @Dea = @Dif * @KValue + @Dea * (1-@KValue);

      INSERT INTO @macd (
        StockCode,    BusinessDay,    Dif,
        Dea,    Macd
      ) VALUES (
        @StockCode,  @BusinessDay,   @Dif,
        @Dea,   (@Dif-@Dea) * 2
      );
    END
    -- 索引遞增.
    SET @EmaIndex = @EmaIndex + 1;
    -- 填充 下一條 數據.
    FETCH NEXT FROM C INTO @BusinessDay, @Dif;
  END

  -- 關閉游標.
  CLOSE C;
  -- 釋放游標.
  DEALLOCATE C;

  RETURN;

END


GO

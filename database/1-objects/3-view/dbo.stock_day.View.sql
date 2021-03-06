USE [stock]
GO
/****** Object:  View [dbo].[stock_day]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[stock_day]
as
  select stockId as stock_code
        ,dte as business_day
        ,p_open as open_price 
        ,p_high as high_price
        ,p_low  as low_price
        ,price as close_price
        ,vol as volume
    from stk

GO

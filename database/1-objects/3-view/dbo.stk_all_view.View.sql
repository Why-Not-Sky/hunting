USE [stock]
GO
/****** Object:  View [dbo].[stk_all_view]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[stk_all_view]
as
 select * from stk_2012
 union
 select * from stk_2013
 union
 select * from stk_2014
GO

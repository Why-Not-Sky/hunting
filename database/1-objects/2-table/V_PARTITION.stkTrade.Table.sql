USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkTrade]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkTrade](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[p_open] [float] NULL,
	[p_high] [float] NULL,
	[p_low] [float] NULL,
	[price] [float] NULL,
	[vol] [float] NULL,
	[KD] [int] NULL,
	[updown] [float] NULL,
	[RS] [float] NULL,
	[VAD] [int] NULL
) ON [PRIMARY]

GO

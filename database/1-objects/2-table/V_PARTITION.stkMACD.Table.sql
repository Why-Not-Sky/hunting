USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkMACD]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkMACD](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[dif] [float] NULL,
	[macd] [float] NULL,
	[osc] [float] NULL,
	[ent12] [float] NULL,
	[ent26] [float] NULL
) ON [PRIMARY]

GO

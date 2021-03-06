USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkRSI]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkRSI](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[RSI6] [float] NULL,
	[EMAU6] [float] NULL,
	[EMAD6] [float] NULL,
	[RSI12] [float] NULL,
	[EMAU12] [float] NULL,
	[EMAD12] [float] NULL
) ON [PRIMARY]

GO

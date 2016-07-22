USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkSC2]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkSC2](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[sc_RSI8] [int] NULL,
	[sc_RSI25] [int] NULL,
	[sc_K26] [int] NULL,
	[sc_D26] [int] NULL
) ON [PRIMARY]

GO

USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkRSI825]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkRSI825](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[RSI8] [float] NULL,
	[EMAU8] [float] NULL,
	[EMAD8] [float] NULL,
	[RSI25] [float] NULL,
	[EMAU25] [float] NULL,
	[EMAD25] [float] NULL
) ON [PRIMARY]

GO

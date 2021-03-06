USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkSC]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkSC](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[sc_ma10] [smallint] NULL,
	[sc_ma20] [smallint] NULL,
	[sc_ma60] [smallint] NULL,
	[sc_ma120] [int] NULL,
	[sc_osc] [smallint] NULL,
	[sc_mfi] [smallint] NULL,
	[sc_kdk] [smallint] NULL,
	[sc_kdd] [smallint] NULL,
	[sc_adx] [smallint] NULL,
	[dif_adx] [float] NULL
) ON [PRIMARY]

GO

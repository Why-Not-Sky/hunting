USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkDMI]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkDMI](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[DI_P] [float] NULL,
	[DI_M] [float] NULL,
	[ADX] [float] NULL,
	[TR] [float] NULL,
	[DM_P] [float] NULL,
	[DM_M] [float] NULL
) ON [PRIMARY]

GO

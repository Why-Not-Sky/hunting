USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkMa]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkMa](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[ma5] [float] NULL,
	[ma10] [float] NULL,
	[ma20] [float] NULL,
	[ma60] [float] NULL,
	[ma120] [float] NULL,
	[ma240] [float] NULL,
	[ma200] [float] NULL,
	[va5] [int] NULL,
	[va10] [int] NULL,
	[va20] [int] NULL,
	[RS20] [float] NULL
) ON [PRIMARY]

GO

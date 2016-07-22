USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkKD]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkKD](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[KDK] [float] NULL,
	[KDD] [float] NULL
) ON [PRIMARY]

GO

USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkVAD]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkVAD](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[va5] [int] NULL,
	[va10] [int] NULL,
	[va20] [int] NULL
) ON [PRIMARY]

GO

USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkMaTrend]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkMaTrend](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[ud20] [nvarchar](1) NULL,
	[ud60] [nvarchar](1) NULL,
	[ud200] [nvarchar](1) NULL,
	[ud_K] [nvarchar](1) NULL,
	[ud_D] [nvarchar](1) NULL
) ON [PRIMARY]

GO

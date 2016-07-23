USE [stock]
GO
/****** Object:  Table [dbo].[stkid]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[stkid](
	[stockid] [nvarchar](10) NULL,
	[stkname] [nvarchar](20) NULL,
	[cl] [nvarchar](50) NULL,
	[minbw_dte] [datetime] NULL,
	[minbw] [float] NULL,
	[sqdays] [smallint] NULL,
	[price] [float] NULL,
	[dte] [datetime] NULL,
	[rmk] [nvarchar](255) NULL,
	[web] [nvarchar](100) NULL,
	[model] [nvarchar](50) NULL,
	[flgbasic] [nvarchar](1) NULL
) ON [PRIMARY]

GO

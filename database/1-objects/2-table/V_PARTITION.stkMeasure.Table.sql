USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkMeasure]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [V_PARTITION].[stkMeasure](
	[stockId] [nvarchar](10) NOT NULL,
	[dte] [datetime] NOT NULL,
	[measure_type] [varchar](10) NOT NULL,
	[measure_value] [float] NOT NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO

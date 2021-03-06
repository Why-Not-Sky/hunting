USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkBoolean]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkBoolean](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[stddev20] [float] NULL,
	[ub] [float] NULL,
	[lb] [float] NULL,
	[percentb] [float] NULL,
	[bandwidth] [float] NULL,
	[ptbmfi] [float] NULL,
	[ptbrsi12] [float] NULL,
	[ptbrsi6] [float] NULL,
	[ptbw] [float] NULL,
	[stdbw] [float] NULL,
	[ptbadx] [float] NULL
) ON [PRIMARY]

GO

USE [stock]
GO
/****** Object:  Table [V_PARTITION].[stkMFI]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [V_PARTITION].[stkMFI](
	[stockId] [nvarchar](10) NULL,
	[dte] [datetime] NULL,
	[MFI] [float] NULL
) ON [PRIMARY]

GO

USE [stock]
GO
/****** Object:  UserDefinedFunction [dbo].[ufn_2join]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create function [dbo].[ufn_2join](@key_pair nvarchar(128))
/* a,b,c --> s.a=d.a and s.b=d.b 
  select dbo.ufn_2join('a,b,c')
*/
returns nvarchar(256)
begin
  --declare @key_pair nvarchar(128); set @key_pair='a,b,c'; select CHARINDEX(',', @key_pair)
  declare @join nvarchar(256), @pos int, @key  nvarchar(256)
  select @join='', @key_pair=@key_pair+','
  
  while CHARINDEX(',', @key_pair)>0 begin
    set @pos=CHARINDEX(',', @key_pair)
    set @key=SUBSTRING(@key_pair, 1, @pos-1)
    set @join=@join + CASE WHEN LEN(@join)>0 THEN ' and ' ELSE '' END
                    + 's.' + RTRIM(LTRIM(@key)) + '=d.' + RTRIM(LTRIM(@key))
    set @key_pair=SUBSTRING(@key_pair, @pos+1, 256)
    --select @key_pair, @pos, @key, @join
  end
  
  return (@join)
end



GO

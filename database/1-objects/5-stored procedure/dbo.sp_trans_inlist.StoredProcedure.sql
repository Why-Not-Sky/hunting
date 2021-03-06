USE [stock]
GO
/****** Object:  StoredProcedure [dbo].[sp_trans_inlist]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create procedure [dbo].[sp_trans_inlist](
        @clist varchar(255), 
        @result varchar(255) output)
as
  declare @i int, @first int
  declare @SNGQUOTE char(1)

  select @SNGQUOTE = '''', @first = 0

  -- add quote string for single quote
  select @clist = replace(@clist, '''', @SNGQUOTE+@SNGQUOTE)

  select @i = charindex( ',', @clist), @result = ''

  -- loop to parse for each string segment to add quote 
  while ((len(@clist) > 0) ) begin
     select @i = charindex( ',', @clist)

     if (@i != 0) begin
        select @result =  @result + @SNGQUOTE + LTrim(RTrim(Left(@clist, @i-1))) + @SNGQUOTE      
        select @result = @result + ','
        select @clist = LTrim(RTrim(Substring(@clist, @i+1, 8000)))
      end else begin
        select @result = @result + @SNGQUOTE + @clist + @SNGQUOTE
        select @clist = ''
      end--else
  end --While

GO

USE [stock]
GO
/****** Object:  StoredProcedure [dbo].[usp_remove_duplicated]    Script Date: 2016/7/22 下午 02:05:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[usp_remove_duplicated]
/*
  drop table t1
  create table t1 (c1 int, c2 int, c3 varchar(20))
  insert into t1 values(1, 1, 'sky')
  insert into t1 values(1, 1, 'michelle')
  insert into t1 values(1, 2, 'ming')
  insert into t1 values(1, 3, 'sunny')
  select * from t1;
 
  exec usp_remove_duplicated t1, 'c1,c2', 'c3'
  select * from t1;
*/
(@table_name nvarchar(64)
 ,@key_pair nvarchar(128)
 ,@order_by nvarchar(128))
as begin
 declare @sql nvarchar(max), @join_key nvarchar(256)
       , @key_table nvarchar(256), @tid nvarchar(256), @duplicated nvarchar(256)
 
 set @tid= convert(varchar(255), newid()) --convert(varchar, datediff(s, '2013/01/01', getdate()))+convert(varchar, datepart(ms, getdate()))
 set @key_table='[##k_' + @tid + ']'
 set @duplicated='[##d_'+ @tid + ']'
 
 begin tran
 --find duplicated
 select @sql=' select ' + @key_pair
             + ' into ' + @key_table + ' from ' + @table_name
             + ' group by ' + @key_pair
             + ' having COUNT(*) > 1 '
             + ' order by '  + @key_pair
 select (@sql); exec (@sql); 
 
 select @join_key=dbo.ufn_2join(@key_pair)
 
 --backup unique and identified by id
 select @sql=' select distinct s.* ' + ', ROW_NUMBER() OVER(PARTITION BY ' + @key_pair + ' ORDER BY ' + @order_by + ') as ROW_NO '
            +' into ' + @duplicated
            --+' from '+ @table_name + ' s join ' + @key_table + ' d '
            --+' on (' + @join_key + ')'
            +' from '+ @table_name + ' s '
			+' where exists (select 1 from ' + @key_table + ' d where '  + @join_key + ')'
 select (@sql); exec (@sql)
 
 --remove dupliated
 select @sql=' delete s' 
            +' from '+ @table_name + ' s join ' + @key_table + ' d '
            +' on (' + @join_key + ')'
 select (@sql); exec (@sql);

 --reserved only first row
  select @sql=' delete ' 
            +' from '+ @duplicated 
            + ' where ROW_NO > 1'
 select (@sql); exec (@sql);

 --drop the row number to avoid the insert failed
  select @sql=' alter table ' + @duplicated + ' drop column ROW_NO'            
 select (@sql); exec (@sql);

 --restore only
 select @sql=' insert into ' + @table_name 
            + ' select * from '  + @duplicated 
 exec (@sql)  
 
 select (@sql); exec ('select * from ' + @key_table); exec ('select * from ' + @duplicated)
 exec ('drop table ' + @key_table);exec ('drop table ' + @duplicated)

 commit tran   
end
GO

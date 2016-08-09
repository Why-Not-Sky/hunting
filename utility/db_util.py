# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------



------------------------------------------------------------------------------------------------------------------------------------------
non-function requirement: 
    * 
    * 
    * 

------------------------------------------------------------------------------------------------------------------------------------------
feature list:
    * 
    * 
    * 

---------------------------------------------------------------------------------------------------------------------------------------'''
import psycopg2

_DEFAULT_CONNECTION = 'dbname=stock user=stock password=stock'

def execute_sql(connection=None, connection_str=_DEFAULT_CONNECTION, sql=None):
    # get a cursor
    if not (connection is None): connection = psycopg2.connect(connection_str)
    cursor = connection.cursor()
    #print(sql)
    cursor.execute(sql)
    connection.commit()
    # just in case, close and resurrect cursor
    cursor.close()

def main():
    pass


if __name__ == '__main__':
    main()
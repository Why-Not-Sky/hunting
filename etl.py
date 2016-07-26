# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
0.1     2016/07/26  sky     Scrap the stock data from web and etl to database


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
class data_object():
    def  __init__(self, dtype, url):
        self.type=dtype
        self.url=url

class etl():
    def __init__(self):
        self.source = data_object('url', 'http:')
        pass

    def _extract(self):
        pass

    def _transformation(self):
        pass

    def _load(self):
        pass

    def run(self):
        self._extract()
        self._transform()
        self._load()

class tse(etl):
    def __init__(self):
        pass

def main():
    pass

if __name__ == '__main__':
    main()
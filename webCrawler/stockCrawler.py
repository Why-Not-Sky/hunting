# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
2016/08/09      delete need add connection.commit() to fresh the data

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
import re
import petl
import time
import psycopg2

import utility.db_util as db_util
from utility import date_util, math_util, stock_util
from webCrawler import webTableCrawler
#import webHtmlTableCrawler, webJsonTableCarwler

# set up a CSV file to demonstrate with

_CONNECTION = 'dbname=stock user=stock password=stock'
_ENGLISH_HEADER = 'symbol_id,name,volume,trans,amount,open,high,low,close,sign,change,af_buy,af_buy_amount,af_sell,af_sell_amout,pe'.split(
    ',')
_HEADER = 'symbol_id,trade_date,volume,amount,open,high,low,close,change,trans'.split(',')

class tseCrawler(webTableCrawler.webHtmlTableCrawler):
    def __init__(self, trade_date='20160701', short=True):
        self.trade_date = trade_date
        self._taiwan_date = date_util.to_taiwan_date(trade_date)
        self.url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL".format(self._taiwan_date)
        self.postfix = 't'

        outfile =  ('{}-{}.csv').format(trade_date, self.postfix)  # outdate.replace('/', ''))
        xheader = '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  # '//*[@id="main-content"]/table[2]/thead/tr[2]'
        xbody = '//table[2]/tbody/tr'  # loop for td to get the table content

        self.short = short
        fn_transform = self._transform if short else None
        self.cols_to_clean = list(range(2, 10))  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

        super(tseCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, cols_to_clean=self.cols_to_clean, fn_transform=fn_transform)

    def _clean(self, x):
        return(stock_util.to_number(x, None))

    def _transform(self, row=None):  # , date_str=None):
        # to-do: use dynamic arguments
        # filter non open market data
        if len(row[0]) != 4: return (None)

        sign = '-' if len(row[9]) == 1 and row[9] in ['-', u'－'] else ''
        change = sign + row[10]
        return (row[0], self.trade_date, row[2], row[4], row[5], row[6], row[7], row[8], change, row[3])

    def get_header(self):
        if (self.short):
            if (self.doc is None): self.get_doc()
            self.header = _HEADER
        else:
            super(tseCrawler, self).get_header()

class otcCrawler(webTableCrawler.webJsonTableCarwler):
    def __init__(self, trade_date='20160701', short=True):
        self.trade_date = trade_date
        self._taiwan_date = date_util.to_taiwan_date(trade_date)

        self.postfix = 'o'
        ttime = str(int(time.time() * 100))
        self.url = 'http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?l=zh-tw&d={}&_={}'.format(self._taiwan_date, ttime)

        outfile =  ('{}-{}.csv').format(trade_date, self.postfix)  # outdate.replace('/', ''))
        xheader = None
        xbody =  ['mmData', 'aaData']

        self.short = short
        fn_transform = self._transform if short else None
        self.cols_to_clean = list(range(2, 10))  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

        super(otcCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, cols_to_clean=self.cols_to_clean, fn_transform=fn_transform)

    def _clean(self, x):
        return(stock_util.to_number(x))

    def _transform(self, row=None):  # , date_str=None):
        # filter non open market data
        if len(row[0]) != 4: return (None)

        return (row[0], self.trade_date, row[8], row[9], row[4], row[5], row[6], row[2], row[3], row[10])

    def get_header(self):
        if (self.doc is None): self.get_doc()
        self.header = _HEADER

class etl():
    def __init__(self):
        self._connection = None

    def _get_connection(self):
        self._connection = self._connection if (self._connection is not None) else psycopg2.connect(_CONNECTION)
        return self._connection

    def extract(self):
        pass

    def transform(self):
        pass

    def _clean_db(self):
        #sql = "delete from quotes where trade_date = '{}';".format(date_util.str_to_date(trade_date))
        #db_util.execute_sql(connection=self._get_connection(), sql=sql)
        pass

    def load(self, trade_date=None, is_delete=True):
        connection = self._get_connection()  # psycopg2.connect(_CONNECTION)
        #petl.todb(self.rows, connection, 'quotes', drop=False)  # , truncate=False)
        pass

    def run(self, *args, **kwargs):
        self.extract()
        self.transform()
        self.load()

class stockQuotesCrawler(etl):
    def __init__(self, trade_date=None):
        super(stockQuotesCrawler, self).__init__()
        self._trade_date = trade_date
        self.rows = None

    def set_trade_date(self, trade_date=None):
        self._trade_date = trade_date

    def get_historical_quotes(self, trade_date=None):
        tse = tseCrawler(trade_date=trade_date).get_table()
        otc = otcCrawler(trade_date=trade_date).get_table()

        table = petl.stack(tse, otc)
        return (table)

    def extract(self, trade_date=None):
        pass

    def transform(self, trade_date=None):
        trade_date = trade_date if trade_date is not None else self._trade_date
        self.rows = self.get_historical_quotes(trade_date=trade_date)

    def _clean_db(self, trade_date='19000101'):
        sql = "delete from quotes where trade_date = '{}';".format(date_util.str_to_date(trade_date))
        db_util.execute_sql(connection=self._get_connection(), sql=sql)

    def load(self, trade_date=None, is_delete=True):
        if not (trade_date is None): self.set_trade_date(trade_date)

        connection = self._get_connection() #psycopg2.connect(_CONNECTION)
        if is_delete: self._clean_db(self._trade_date)

        petl.todb(self.rows, connection, 'quotes', drop=False) #, truncate=False)

    def run(self, trade_date=None):
        trade_date = trade_date if trade_date is not None else self._trade_date
        self.set_trade_date(trade_date=trade_date)
        super(stockQuotesCrawler, self).run()
        #self.extract()
        #self.transform()
        #self.load()

class revenueCrawler(etl):
    def __init__(self, monthly=None):
        self._connection = None
        self.rows = None
        self._monthly = monthly
        self._year =  int(monthly[:4])
        self._taiwan_year = self._year - 1911
        self._month = int(monthly[4:])
        self._outfile = monthly + '.csv'
        self._encode = 'Big5'
        self._header = ['公司', '公司名稱', '當月營收', '上月營收', '去年當月營收', '上月比較', '去年同月', '當月累計營收', '去年累計營收', '前期比較']
        self._english = ['symbol_id', 'revenue', 'last_month', 'last_year', 'to_last_month', 'to_last_year'
                    , 'cumulative', 'cumulative_last_year', 'cumulative_to_last_year', 'rev_year', 'rev_month', 'period']
        self.cols_to_clean = list(range(9)) #[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        self._source = [
                dict(url='http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html'.format(self._taiwan_year, self._month),
                     outfile= monthly+ '-t' + '.csv', reload=False, encode=self._encode, xheader=None,
                     fn_clean=stock_util.to_number, cols_to_clean=self.cols_to_clean, fn_transform=self._transform, xbody='//tr[@align="right"]'),
                dict(url='http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_0.html'.format(self._taiwan_year, self._month),
                     outfile=monthly+ '-o' + '.csv', reload=False, encode=self._encode,
                     fn_clean=stock_util.to_number, cols_to_clean=self.cols_to_clean, fn_transform=self._transform, xheader=None, xbody='//tr[@align="right"]')
                ]

        super(revenueCrawler, self).__init__()

    def to_big5(x=''):
        x = x.encode('latin1', 'ignore').decode('big5')  #for chinese name, but not use for import caused normalization
        return x
    
    def _transform(self, row=None):  # , date_str=None):
        # to-do: use dynamic arguments
        if len(row[0]) != 4: return []
        r = row[:10]
        r.pop(1)
        r += [self._year, self._month, 'M']
        return (r)
    
    def transform(self):
        table=None
        for src in self._source:
            sc = webTableCrawler.webHtmlTableCrawler(**src)
            #sc.run()
            #r=sc.rows
            r = sc.get_table()
            if (r is not None) and (len(r) > 0):
                table = petl.stack(table, r) if table is not None else r
            #print (table)

        #self.rows = petl.headers.pushheader(table, self._header)
        #todo: need to solve the issue to clear unexpected rows. (done by add filter in transform)
        self.rows = petl.headers.pushheader(table, self._english)
        symbolist = ['1101', '1102', '1103']
        #self.rows = petl.select(table, lambda rec: rec.symbol_id in symbolist)
        #self.rows = petl.select(self.rows, lambda rec: len(rec.symbol_id) == 4)      #4,344的資料有問題
        self.rows = petl.transform.dedup.distinct(self.rows)

        petl.tocsv(self.rows, source=sc.data_path + self._outfile)

        return (self.rows)

    def _clean_db(self):
        sql = "delete from revenue where rev_year={} and rev_month={} and period='M';".format(self._year, self._month)
        db_util.execute_sql(connection=self._get_connection(), sql=sql)

    def load(self):
        connection = self._get_connection()  # psycopg2.connect(_CONNECTION)
        self._clean_db()

        petl.todb(self.rows, connection, 'revenue', drop=False)  # , truncate=False)

def test_stockQuotesCrawler():
    trade_date = '20160810'
    print('Crawling {}...'.format(trade_date))
    sq = stockQuotesCrawler(trade_date)
    sq.run()

def test_revenueCrawler():
    start_month = '201112'
    rc = revenueCrawler(monthly=start_month)
    rc.run()
    print(rc.rows)

def main():
    test_stockQuotesCrawler()
    test_revenueCrawler()

if __name__ == '__main__':
    main()

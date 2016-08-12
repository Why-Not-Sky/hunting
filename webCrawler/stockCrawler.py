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
import string
import psycopg2

import utility.db_util as db_util
from utility import date_util
from webCrawler import webTableCrawler
#import webHtmlTableCrawler, webJsonTableCarwler

# set up a CSV file to demonstrate with

_CONNECTION = 'dbname=stock user=stock password=stock'
_CONVERT_ZERO = ['', '--', '---', '---', 'x', 'X', 'null', 'NULL']  # convert illegal value into 0
_ENGLISH_HEADER = 'symbol_id,name,volume,trans,amount,open,high,low,close,sign,change,af_buy,af_buy_amount,af_sell, af_sell_amout,pe'.split(
    ',')
_HEADER = 'symbol_id,trade_date,volume,amount,open,high,low,close,change,trans'.split(',')

def to_number(x=''):
    col = re.sub(",", "", x.strip())
    col = ''.join(list(filter(lambda x: x in string.printable, col)))
    return '0' if (col in _CONVERT_ZERO) else col

class etl():
    def __init__(self):
        self._connection = None
        self.rows = None

    def _get_connection(self):
        self._connection = self._connection if (self._connection is not None) else psycopg2.connect(_CONNECTION)
        return self._connection

    def extract(self, trade_date=None):
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

        super(tseCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, fn_transform=fn_transform)

    def _clean(self, x):
        return(to_number(x))

    def _transform(self, row=None):  # , date_str=None):
        # to-do: use dynamic arguments
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

        super(otcCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, fn_transform=fn_transform)

    def _clean(self, x):
        return(to_number(x))

    def _transform(self, row=None):  # , date_str=None):
        return (row[0], self.trade_date, row[8], row[9], row[4], row[5], row[6], row[2], row[3], row[10])

    def get_header(self):
        if (self.doc is None): self.get_doc()
        self.header = _HEADER

class stockQuotesCrawler():
    def __init__(self, trade_date=None):
        self._trade_date = trade_date
        self._connection = None
        self.rows = None

    def set_trade_date(self, trade_date=None):
        self._trade_date = trade_date

    def _get_connection(self):
        self._connection = self._connection if (self._connection is not None) else psycopg2.connect(_CONNECTION)
        return self._connection

    def get_historical_quotes(trade_date=None):
        tse = get_historical_quotes_tse(trade_date=trade_date)
        otc = get_historical_quotes_otc(trade_date=trade_date)

        table = petl.stack(tse, otc)
        return (table)

    def extract(self, trade_date=None):
        pass

    def transform(self, trade_date=None):
        trade_date = trade_date if trade_date is not None else self._trade_date
        self.rows = get_historical_quotes(trade_date=trade_date)

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
        self.extract()
        self.transform()
        self.load()

class revenueCrawler(etl):
    def __init__(self, monthly=None):
        self._connection = None
        self.rows = None
        self._monthly = monthly
        self._taiwan_year = int(monthly[:4]) - 1911
        self._month = int(monthly[5:])
        self._outfile = monthly + '.csv'
        self._encode = 'Big5'
        self._source = [
                dict(url='http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html'.format(self._taiwan_year, self._month),
                     outfile= monthly+ '-t' + '.csv', encode=self._encode, xheader=None, fn_clean=to_number,
                     fn_transform=self._transform, xbody='//tr[@align="right"]'),
                dict(url='http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_0.html'.format(self._taiwan_year, self._month),
                     outfile=monthly+ '-o' + '.csv', encode=self._encode, fn_clean=to_number, fn_transform=self._transform,
                     xheader=None, xbody='//tr[@align="right"]')
                ]
        self._header = ['公司', '公司名稱', '當月營收', '上月營收', '去年當月營收', '上月比較', '去年同月', '當月累計營收', '去年累計營收', '前期比較']
        self._english = 'symbol_id,rev_month,revenue,last_month,last_year,to_last_month, to_last_year,cumulative,cumulative_to_last_year'.split(',')

        super(revenueCrawler, self).__init__()

    def to_big5(x=''):
        x = x.encode('latin1', 'ignore').decode('big5')  #for chinese name, but not use for import caused normalization
        return x
    
    def _transform(self, row=None):  # , date_str=None):
        # to-do: use dynamic arguments
        r = row[:10]
        r[1] = self._monthly
        return (r)
    
    def transform(self):
        '''
        sc = webTableCrawler.webHtmlTableCrawler(url=self._url, outfile=self._outfile, encode='Big5'
                                                 , fn_clean=to_number, fn_transform=self._transform, xbody=self._xbody)
        '''
        table=None
        for src in self._source:
            sc = webTableCrawler.webHtmlTableCrawler(**src)
            #sc.header = self._english
            #sc.run()
            #r=sc.rows
            r = sc.get_table()
            if (r is not None) and (len(r) > 0):
                table = petl.stack(table, r) if table is not None else r
            #print (table)

        table = petl.headers.pushheader(table, self._english)
        self.rows = petl.select(table, lambda rec: len(rec.symbol_id) == 4)
        #petl.tocsv(self.rows, source=self._outfile)

        return (self.rows)

def get_reverue_monthly(rev_month):
    rc = revenueCrawler(monthly=rev_month)
    rc.run()
    return (rc.rows)
    
def get_historical_quotes_tse(trade_date= '20160701'):
    sc = tseCrawler(trade_date=trade_date)
    sc.run()
    return (sc.rows)

def get_historical_quotes_otc(trade_date= '20160701'):
    sc = otcCrawler(trade_date=trade_date)
    sc.run()
    return (sc.rows)

def get_historical_quotes(trade_date= '20160701'):
    tse = get_historical_quotes_tse(trade_date=trade_date)
    otc = get_historical_quotes_otc(trade_date=trade_date)

    table = petl.stack(tse, otc)
    return (table)

def test_stockQuotes():
    trade_date = '20160808'
    print('Crawling {}...'.format(trade_date))
    sq = stockQuotesCrawler(trade_date)
    #sq._clean_db(trade_date)
    sq.run()

def test_get_reverue_monthly():
    rev_month = '201607'
    print('Crawling {}...'.format(rev_month))
    print(get_reverue_monthly(rev_month))

def main():
    test_get_reverue_monthly()
    #get_historical_quotes_tse()

if __name__ == '__main__':
    main()

# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
0.1     2016/07/26  sky     refactoring from crawl2.py
1.1d    2016/07/27          use etl library and load into database
                            issue: can't identify the load operation between tse and otc


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
import csv
import json
import logging
import re
import string
import time
from os import mkdir
from os.path import isdir

import petl as etl
import psycopg2
from lxml import html

import utility.db_util as db
from utility import date_util as util
from utility import web_util as webutil

class data_object():
    def  __init__(self, dtype, url):
        self.type=dtype
        self.url=url

# set up a CSV file to demonstrate with
_CONNECTION = 'dbname=stock user=stock password=stock'
_EXTRACT_PATH = './extract'
_DATA_PATH = './transform'
_HEADER_LINE = 'symbol_id,trade_date,volume,amount,open,high,low,close,change,trans'
_HEADER = _HEADER_LINE.split(',')
_CONVERT_ZERO = ['', '--', '---', 'x', 'X', 'null', 'NULL']   # convert illegal value into 0

class WebCrawler():
    def __init__(self, prefix=_DATA_PATH, origin = _EXTRACT_PATH):
        ''' Make directory if not exist when initialize '''
        if not isdir(prefix): mkdir(prefix)
        self.prefix = prefix

        if not isdir(origin): mkdir(origin)
        self.origin = origin

        self.url = ''
        self.postfix = ''
        self._connection = None

    def set_trade_date(self, trade_date='20160701'):
        self._trade_date = trade_date
        self._taiwan_date = util.to_taiwan_date_str(trade_date, '/')
        self.origin_file = self._get_file_name(self.origin, 'txt')
        self.source_file = self._get_file_name(self.prefix, 'csv')
        self.dest_db = ''

    def _get_connection(self):
        self._connection = self._connection if (self._connection is not None) else psycopg2.connect(_CONNECTION)
        return self._connection

    # get the file in the path
    def _get_file_name(self, path='', appendix='txt'):
        return '{}/{}{}.{}'.format(path, self._taiwan_date.replace('/', ''), self.postfix, appendix)

    def _clean_row(self, row):
        #f_clean = lambda x: '0' if (x in _CONVERT_ZERO) else x

        for index, content in enumerate(row):
            col = re.sub(",", "", content.strip())
            # filter() in python 3 does not return a list, but a iterable filter object. Call next() on it to get the first filtered item:
            col = ''.join(list(filter(lambda x: x in string.printable, col)))
            # transform non-decimal number into decimal
            row[index] = '0' if (col in _CONVERT_ZERO) else col

        return row

    # replace by odo
    def _open_origin_file(self):
        infname = self.origin_file
        infile = open(infname, 'r')  # 'r')  # otc's object type is str
        data = infile.read()
        return data

    def _clean(self, data, dest_file):
        pass

    def extract(self, taiwan_date_str=None):
        if not (taiwan_date_str is None): self.set_trade_date(taiwan_date_str)
        ttime = str(int(time.time() * 100))
        url = self.url.format(self._taiwan_date, ttime)
        fname = self.origin_file
        webutil.save_html(url, fname)
        #util.download_data_by_url(url, fname)

    def transform(self, taiwan_date_str=None):
        # Get html page and parse as tree
        if not (taiwan_date_str is None): self.set_trade_date(taiwan_date_str)
        data = self._open_origin_file()

        dest_file = open(self.source_file, 'w')  # 'ab')

        self._clean(data, dest_file)

        dest_file.close()

    def clean_db(self, trade_date='19000101'):
        db.execute_sql(connection=self._get_connection(), sql="delete from quotes where trade_date = '{}' ".format(trade_date))

    def _load_db(self, taiwan_date_str=None, is_delete=False):
        if not (taiwan_date_str is None): self.set_trade_date(taiwan_date_str)
        raw_file = self.source_file
        tse = etl.fromcsv(raw_file)

        connection = self._get_connection() #psycopg2.connect(_CONNECTION)
        if is_delete: self.clean_db(self._trade_date)

        # assuming table "quotes" already exists in the database, and tse need to have the header.
        # petl.io.db.todb(table, dbo, tablename, schema=None, commit=True, create=False, drop=False, constraints=True,
        #                metadata=None, dialect=None, sample=1000)[source]
        etl.todb(tse, connection, 'quotes', drop=False) #, truncate=False)

    def load(self, taiwan_date_str=None, is_delete=False):
        if not (taiwan_date_str is None): self.set_trade_date(taiwan_date_str)
        self._load_db(is_delete=is_delete)
        pass

    def run(self, date_str):
        ''' 20160701'''
        self.set_trade_date(date_str)
        self.extract()
        self.transform()
        self.load()

class tseWebCrawler(WebCrawler):
    def __init__(self, prefix=_DATA_PATH, origin = _EXTRACT_PATH):
        super(tseWebCrawler, self).__init__(prefix, origin)
        self.postfix = '_T'
        self.url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL"

    def _clean(self, data, dest_file):
        date_str = self._trade_date
        cw = csv.writer(dest_file, lineterminator='\n')
        #add header for etl
        cw.writerow(_HEADER)

        # Parse page
        tree = html.fromstring(data)

        for tr in tree.xpath('//table[2]/tbody/tr'):
            tds = tr.xpath('td/text()')

            sign = tr.xpath('td/font/text()')
            sign = '-' if len(sign) == 1 and sign[0] == u'－' else ''

            row = self._clean_row([
                tds[0].strip(),  # symbol
                date_str,  # 日期
                tds[2],  # 成交股數
                tds[4],  # 成交金額
                tds[5],  # 開盤價
                tds[6],  # 最高價
                tds[7],  # 最低價
                tds[8],  # 收盤價
                sign + tds[9],  # 漲跌價差
                tds[3],  # 成交筆數
            ])

            cw.writerow(row)

class otcWebCrawler(WebCrawler):
    def __init__(self, prefix=_DATA_PATH, origin = _EXTRACT_PATH):
        super(otcWebCrawler, self).__init__(prefix, origin)
        self.postfix = '_O'
        self.url = 'http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?l=zh-tw&d={}&_={}'

    def _clean(self, data, dest_file):
        date_str = self._trade_date
        cw = csv.writer(dest_file, lineterminator='\n')
        cw.writerow(_HEADER)

        result = json.loads(data)  # data.json()

        if result['reportDate'] != self._taiwan_date:
            logging.error("Get error date OTC data at {}".format(date_str))
            return

        for table in [result['mmData'], result['aaData']]:
            for tr in table:
                row = self._clean_row([
                    tr[0],
                    date_str,
                    tr[8],  # 成交股數
                    tr[9],  # 成交金額
                    tr[4],  # 開盤價
                    tr[5],  # 最高價
                    tr[6],  # 最低價
                    tr[2],  # 收盤價
                    tr[3],  # 漲跌價差
                    tr[10]  # 成交筆數
                ])
                cw.writerow(row)

def test_tse(start_date):
    t = tseWebCrawler()
    t.run(start_date)

def test_tse_extract(start_date):
    t = tseWebCrawler()
    t.extract(start_date)

def test_tse_transform(start_date):
    t = tseWebCrawler()
    #t.set_trade_date(start_date)
    t.transform(start_date)

def test_tse_load(start_date):
    t = tseWebCrawler()
    t.load(start_date, is_delete=True)

def test_otc_load(start_date):
    t = otcWebCrawler()
    t.load(start_date)

def test_otc_transform(start_date):
    t = otcWebCrawler()
    #t.set_trade_date(start_date)
    t.transform(start_date)

def test_otc(start_date):
    t = otcWebCrawler()
    t.run(start_date)

def test_get_all(start_date):
    t = tseWebCrawler()
    t.clean_db(start_date)

    t.run(start_date)

    o = otcWebCrawler()
    o.run(start_date)

def main():
    start_date = '20160701'

    t = time.process_time()
    # do some stuff

    start = time.time()
    print ('start crawling at {}...'.format(start))

    #test_get_all(start_date)
    #test_tse_extract(start_date)
    #test_tse_transform(start_date)
    test_tse_load(start_date)
    #test_tse(start_date)
    #test_otc_transform(start_date)
    test_otc_load(start_date)
    #test_otc(start_date)

    end = time.time()
    print('end crawling total: {}...'.format(end - start))

    elapsed_time = time.process_time() - t
    print('elapsed_time: {}...'.format(elapsed_time))

if __name__ == '__main__':
    main()
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
import string
import os
import re
import csv
import time
import json
import logging

from datetime import datetime, timedelta
from os import mkdir
from os.path import isdir
from lxml import html

import date_util as util

class data_object():
    def  __init__(self, dtype, url):
        self.type=dtype
        self.url=url

class WebCrawler():
    def __init__(self, prefix="transform", origin = "extract"):
        ''' Make directory if not exist when initialize '''
        if not isdir(prefix): mkdir(prefix)
        self.prefix = prefix

        if not isdir(origin): mkdir(origin)
        self.origin = origin

        self.url = ''
        self.postfix = ''
        #self._set_trade_date('20160701')

    def set_trade_date(self, trade_date='20160701'):
        self._trade_date = trade_date
        self._taiwan_date = util.to_taiwan_date_str(trade_date, '/')
        self.origin_file = self._get_file_name(self.origin, 'txt')
        self.source_file = self._get_file_name(self.prefix, 'csv')
        self.dest_db = ''

    # get the file in the path
    def _get_file_name(self, path='', appendix='txt'):
        return '{}/{}{}.{}'.format(path, self._taiwan_date.replace('/', ''), self.postfix, appendix)

    def _clean_row(self, row):
        for index, content in enumerate(row):
            row[index] = re.sub(",", "", content.strip())
            # filter() in python 3 does not return a list, but a iterable filter object. Call next() on it to get the first filtered item:
            row[index] = ''.join(list(filter(lambda x: x in string.printable, row[index])))

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
        util.download_data_by_url(url, fname)

    def transform(self, taiwan_date_str=None):
        # Get html page and parse as tree
        if not (taiwan_date_str is None): self.set_trade_date(taiwan_date_str)
        data = self._open_origin_file()

        dest_file = open(self.source_file, 'w')  # 'ab')

        self._clean(data, dest_file)

        dest_file.close()

    def load(self, taiwan_date_str=None):
        if not (taiwan_date_str is None): self.set_trade_date(taiwan_date_str)
        pass

    def run(self, date_str):
        ''' 20160701'''
        self.set_trade_date(date_str)
        self.extract()
        self.transform()
        self.load()

class tseWebCrawler(WebCrawler):
    def __init__(self, prefix="transform", origin = "extract"):
        super(tseWebCrawler, self).__init__(prefix, origin)
        self.postfix = '_T'
        self.url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL"

    def _clean(self, data, dest_file):
        date_str = self._trade_date
        cw = csv.writer(dest_file, lineterminator='\n')

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
    def __init__(self, prefix="transform", origin = "extract"):
        super(otcWebCrawler, self).__init__(prefix, origin)
        self.postfix = '_O'
        self.url = 'http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?l=zh-tw&d={}&_={}'

    def _clean(self, data, dest_file):
        date_str = self._trade_date
        cw = csv.writer(dest_file, lineterminator='\n')

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
    t.transform(start_date)

def test_tse_transform(start_date):
    t = tseWebCrawler()
    #t.set_trade_date(start_date)
    t.transform(start_date)

def main():
    #test_tse_extract('20160701')
    #test_tse_transform('20160701')
    test_tse('20160701')

if __name__ == '__main__':
    main()
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
import re
import petl as etl
import time
import json
import logging

import webTableCrawler as webCrawler
from utility import date_util
from utility import web_util
from lxml import html

_CONVERT_ZERO = ['', '--', '---', '---', 'x', 'X', 'null', 'NULL']  # convert illegal value into 0
_ENGLISH_HEADER = 'symbol_id,name,volume,trans,amount,open,high,low,close,sign,change,af_buy,af_buy_amount,af_sell, af_sell_amout,pe'.split(
    ',')
_HEADER = 'symbol_id,trade_date,volume,amount,open,high,low,close,change,trans'.split(',')

PATH = 'data/'

class tseCrawler(webCrawler.webTableCrawler):
    def __init__(self, trade_date='20160701', short=True):
        self.trade_date = trade_date
        self._taiwan_date = date_util.to_taiwan_date(trade_date)
        self._url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL"
        self.url = self._url.format(self._taiwan_date)
        self.postfix = 't'

        outfile = PATH + ('{}-{}.csv').format(trade_date, self.postfix)  # outdate.replace('/', ''))
        xheader = '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  # '//*[@id="main-content"]/table[2]/thead/tr[2]'
        xbody = '//table[2]/tbody/tr'  # loop for td to get the table content

        self.short = short
        fn_transform = self._transform if short else None

        super(tseCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, fn_transform=fn_transform)

    def _clean(self, x):
        x=x.strip()
        return '0' if (x in _CONVERT_ZERO) else re.sub(",", "", x)

    def _transform(self, row=None):  # , date_str=None):
        # to-do: use dynamic arguments
        sign = '-' if len(row[9]) == 1 and row[9] in ['-', u'－'] else ''
        change = sign + row[10]
        return (row[0], row[1], row[2], row[4], row[5], row[6], row[7], row[8], change, row[3])

    def get_header(self):
        if (self.short):
            if (self.doc is None): self.get_doc()
            self.header = _HEADER
        else:
            super(tseCrawler, self).get_header()

    def get_table(self):
        dest_table = super(tseCrawler, self).get_table()
        if (self.short):
            dest_table = etl.headers.setheader(self.rows, self.header)
            dest_table = etl.transform.conversions.convert(dest_table
                                                       , {'trade_date': lambda v, row: self.trade_date}
                                                       ,
                                                       pass_row=True)  # cause _trade_date not worked --> need row values

        #st = super(tseCrawler, self).get_table()
        self.rows = etl.sort(dest_table, 0)
        return (self.rows)

class otcCrawler(webCrawler.webTableCrawler):
    def __init__(self, trade_date='20160701', short=True):
        self.trade_date = trade_date
        self._taiwan_date = date_util.to_taiwan_date(trade_date)

        self.postfix = 'o'
        self._url = 'http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?l=zh-tw&d={}&_={}'
        ttime = str(int(time.time() * 100))
        self.url = self._url.format(self._taiwan_date, ttime)

        outfile = PATH + ('{}-{}.csv').format(trade_date, self.postfix)  # outdate.replace('/', ''))
        xheader = '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  # '//*[@id="main-content"]/table[2]/thead/tr[2]'
        xbody = '//table[2]/tbody/tr'  # loop for td to get the table content

        self.short = short
        fn_transform = self._transform if short else None

        super(otcCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, fn_transform=fn_transform)

    def _clean(self, x):
        x=x.strip()
        return '0' if (x in _CONVERT_ZERO) else re.sub(",", "", x)

    def _transform(self, row=None):  # , date_str=None):
        return (row[0], row[1], row[8], row[9], row[4], row[5], row[6], row[2], row[3], row[10])

    def get_doc(self, url=None, infile=None):
        self.save_raw_data(url, infile)

        infile = open(self.infile, 'r')  # 'r')  # otc's object type is str
        self.doc = infile.read()
        return (self.doc)

    def get_header(self):
        if (self.doc is None): self.get_doc()
        self.header = _HEADER

    def get_rowlist(self):
        result = json.loads(self.doc)  # data.json()

        if result['reportDate'] != self._taiwan_date:
            logging.error("Get error date OTC data at {}".format(self._taiwan_date))
            return

        #elist = [result['mmData'], result['aaData']]
        elist = result['mmData']
        elist += result['aaData']
        return(elist)

    def get_row(self, el):
        return (el)

    def get_body(self):
        return (super(otcCrawler, self).get_body())

    def get_table(self):
        dest_table = super(otcCrawler, self).get_table()
        if (self.short):
            dest_table = etl.headers.setheader(self.rows, self.header)
            dest_table = etl.transform.conversions.convert(dest_table
                                                       , {'trade_date': lambda v, row: self.trade_date}
                                                       ,
                                                       pass_row=True)  # cause _trade_date not worked --> need row values

        #st = super(tseCrawler, self).get_table()
        self.rows = etl.sort(dest_table, 0)
        return (self.rows)

def get_tse_data(date_str= '20160701'):
    sc = tseCrawler(trade_date=date_str)
    print ('downloading...{}'.format(sc.outfile))
    print(sc.get_table())

def test_tseCralwer():
    date_str= '20160701'

    sc = tseCrawler(trade_date=date_str)
    print(sc.get_table())

def get_otc_data(date_str='20160701'):
    sc = otcCrawler(trade_date=date_str)
    print('downloading...{}'.format(sc.outfile))
    print(sc.get_table())
    #sc.run()
    #sc = tseCrawler(trade_date=date_str, short=False)
    #print(sc.get_table())

def main():
    #test_tseCralwer()
    get_tse_data('20160802')
    get_otc_data('20160802')

if __name__ == '__main__':
    main()

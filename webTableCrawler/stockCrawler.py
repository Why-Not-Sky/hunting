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

class tseCrawler(webCrawler.webHtmlTableCrawler):
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
        x=x.strip()
        return '0' if (x in _CONVERT_ZERO) else re.sub(",", "", x)

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

class otcCrawler(webCrawler.webJsonTableCarwler):
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
        x=x.strip()
        return '0' if (x in _CONVERT_ZERO) else re.sub(",", "", x)

    def _transform(self, row=None):  # , date_str=None):
        return (row[0], self.trade_date, row[8], row[9], row[4], row[5], row[6], row[2], row[3], row[10])

    def get_header(self):
        if (self.doc is None): self.get_doc()
        self.header = _HEADER

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

    table = etl.stack(tse, otc)
    return (table)

def main():
    print(get_historical_quotes_tse())
    print(get_historical_quotes_otc())

if __name__ == '__main__':
    main()

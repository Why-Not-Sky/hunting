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

import webTableCrawler as webCrawler
from utility import date_util

_CONVERT_ZERO = ['', '--', '---', 'x', 'X', 'null', 'NULL']  # convert illegal value into 0
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

        outfile = PATH + ('{}-t.csv').format(trade_date)  # outdate.replace('/', ''))
        xheader = '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  # '//*[@id="main-content"]/table[2]/thead/tr[2]'
        xbody = '//table[2]/tbody/tr'  # loop for td to get the table content

        self.short = short
        fn_transform = self._transform if short else None

        super(tseCrawler, self).__init__(url=self.url, xheader=xheader, xbody=xbody, outfile=outfile,
                                         fn_clean=self._clean, fn_transform=fn_transform)

    def _clean(self, x):
        return '0' if (x in _CONVERT_ZERO) else re.sub(",", "", x.strip(""))

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

def get_tse_data(date_str= '20160701'):
    sc = tseCrawler(trade_date=date_str)
    print ('downloading...{}'.format(sc.outfile))
    sc.run()

def test_tseCralwer():
    date_str= '20160701'

    sc = tseCrawler(trade_date=date_str)
    print(sc.get_table())

    #sc = tseCrawler(trade_date=date_str, short=False)
    #print(sc.get_table())

def main():
    #test_tseCralwer()
    get_tse_data('20160802')

if __name__ == '__main__':
    main()

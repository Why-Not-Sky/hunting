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
import requests
import lxml.html as html
import lxml.html.clean as clean

import utility.db_util as db_util
from utility import date_util, math_util, stock_util, web_util
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

class profitCrawler(etl):
    def __init__(self, years='2015', season='01'):
        self._connection = None
        self.rows = None
        self._year = int(years)
        self._taiwan_year = self._year - 1911
        self._season = season
        self._outfile = years + 'Q' + season[1] + '.csv'
        self._encode = 'Big5'
        self._header = ['公司', '公司名稱', '產業別', '每股盈餘', '普通股每股面額', '營業收入', '營業利益', '營業外收入及支出', '稅後淨利']
        self._english = ['symbol_id',  'eps', 'revenue'
            , 'profit', 'extra_income', 'profit_after_tax', 'years', 'season', 'period']
        self.cols_to_clean = [3, 4, 5, 6, 7, 8]
        self._url = 'http://mops.twse.com.tw/mops/web/t163sb19?step=1&firstin=1&TYPEK=sii&year=104&season=01'.format(self._taiwan_year, self._season)
        self._source = [
            dict(url='http://mops.twse.com.tw/mops/web/t163sb19?step=1&firstin=1&TYPEK=sii&year=104&season=01'.format(self._taiwan_year, self._season),
                 outfile=self._outfile, reload=False, encode=self._encode, xheader=None,
                 fn_clean=stock_util.to_number, cols_to_clean=self.cols_to_clean, fn_transform=self._transform)
        ]

        super(profitCrawler, self).__init__()

    def _to_big5(self, x=''):
        x = x.encode('latin1', 'ignore').decode('big5')  # for chinese name, but not use for import caused normalization
        return x

    #todo: each column's clean function is different.
    #1102,亞洲水泥股份有限公司,水泥工業,0.47,新台幣                 10.0000元,"15,362,530","1,037,375","807,325","1,542,288"
    def _transform(self, row=None):  # , date_str=None):
        if len(row[0]) != 4: return []
        r = [stock_util.to_number(row[idx]) if idx >= 3 else row[idx].strip() for idx, r in enumerate(row)]
        return [r[0], r[3], r[5], r[6], r[7], r[8], self._year, self._season, 'Q']

    def get_rows(self, txt=None):
        tree = clean.clean_html(html.fromstring(txt))
        xtable = '//*[@id="table01"]/table'
        etable = tree.xpath(xtable)
        rows = []
        for tb in etable:
            er = tb.xpath('tr')
            for tr in er:
                row = list(map(lambda x: x.strip(), tr.xpath('td/text()')))
                if len(row) > 0:
                    rows.append(self._transform(row))
        return rows

    def transform(self):
        #src = self._source[0]
        #sc = webTableCrawler.WebCrawler(**src)
        sc = webTableCrawler.WebCrawler(url=self._url)
        table = self.get_rows(sc.rawdata)

        self.rows = petl.headers.pushheader(table, self._english)

        if (self.rows is not None):
            petl.tocsv(self.rows, source=sc.data_path + self._outfile)

        return (self.rows)

    def _clean_db(self):
        sql = "delete from profit where years={} and season={} and period='Q';".format(self._year, self._season)
        db_util.execute_sql(connection=self._get_connection(), sql=sql)

    def load(self):
        connection = self._get_connection()  # psycopg2.connect(_CONNECTION)
        self._clean_db()

        petl.todb(self.rows, connection, 'profit', drop=False)  # , truncate=False)

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

'''Foreign & Institutional Investors Daily Trading sort by stock code
tse: http://www.twse.com.tw/ch/trading/fund/T86/T86.php
otc:http://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge.php?l=zh-tw
Foreign&MainlandChinese(外資), SecuritiesInvestmentCo(投信), Dealers(自營商)(proprietary),Dealers(hedge)
'''
class institutionalDailyTradingCrawler(etl):
    def __init__(self, trade_date=None):
        super(institutionalDailyTradingCrawler, self).__init__()

        self._trade_date = trade_date
        self._taiwan_date =  self._taiwan_date = date_util.to_taiwan_date(trade_date)
        self.rows = None
        self._outfile = trade_date + '.csv'

        self._header = ['代號',	'名稱',	'外資買',	'外資賣',	'外資淨買','投信買','投信賣','投信淨買','自營商淨買','自營商(自行買賣)買',	'自營商(自行買賣)賣','自營商(自行買賣)淨買','自營商(避險)買','自營商(避險)賣',	'自營商(避險)淨買','三大法人買賣超']
        self._english = ['code', 'trade_date', 'foregin_purchase','foregin_sale','foregin_net_purchase','sic_purchase', 'sic_sale', 'sic_net_purchase'
            ,'dealers_net_purchase','dealers_prop_purchase','dealers_prop_sale','dealers_prop_net_purchase', 'dealers_hedge_purchase', 'Dealers_hedge_sale', 'dealers_hedge_net_purchase',	'total_net_purchase']
        self.cols_to_clean =  list(range(2, len(self._english)))

        self._source = [
            dict(url='http://www.twse.com.tw/ch/trading/fund/T86/T86.php?',
                 payload = {
                    'download': None,
                    'qdate': self._taiwan_date,
                    'select2': 'ALLBUT0999',
                    'sorting': 'by_issue' #'by_stkno'
                 },
                 outfile=trade_date + '-t' + '.csv', reload=True,
                 fn_clean=stock_util.to_number, cols_to_clean=self.cols_to_clean, fn_transform=self._transform,
                 xbody='//*[@id="tbl-sortable"]/tbody/tr'),
            dict(url='http://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_print.php?l=zh-tw&se=EW&t=D&d={}&s=0,asc,0'.format(self._taiwan_date),
                 outfile=trade_date + '-o' + '.csv', reload=True,
                 fn_clean=stock_util.to_number, cols_to_clean=self.cols_to_clean, fn_transform=self._transform,
                 xbody='//tbody/tr')
        ]

    def _transform(self, row=None):  # , date_str=None):
        #if len(row[0]) != 4: return []
        r = [stock_util.to_number(row[idx]) if idx >= 2 else row[idx].strip() for idx, r in enumerate(row)]
        r[1] = self._trade_date

        return (r)

    def transform(self):
        table = None
        for src in self._source:
            sc = webTableCrawler.webHtmlTableCrawler(**src)
            r = sc.get_table()
            if (r is not None) and (len(r) > 0):
                table = petl.stack(table, r) if table is not None else r
                #print ('number of rows:{}'.format(len(table)))

        self.rows = petl.headers.pushheader(table, self._english)
        petl.tocsv(self.rows, source=sc.data_path + self._outfile)

        return (self.rows)

    def _clean_db(self):
        return
        sql = "delete from institution_trading where trade_date={};".format(self._trade_dateh)
        db_util.execute_sql(connection=self._get_connection(), sql=sql)

    def load(self):
        return
        connection = self._get_connection()
        self._clean_db()

        petl.todb(self.rows, connection, 'institution_trading', drop=False)  # , truncate=False)


def test_stockQuotesCrawler():
    trade_date = '20160810'
    print('Crawling {}...'.format(trade_date))
    sq = stockQuotesCrawler(trade_date)
    sq.run()


def test_institutionalDailyTradingCrawler():
    trade_date = '20160823'
    print('Crawling {}...'.format(trade_date))
    sq = institutionalDailyTradingCrawler(trade_date)
    sq.run()
    print('number of rows:{}'.format(len(sq.rows)))
    print (sq.rows)


def test_revenueCrawler():
    start_month = '201112'
    rc = revenueCrawler(monthly=start_month)
    rc.run()
    print(rc.rows)

def test_profitCrawler(year='2016', season='02'):
    rc = profitCrawler(year, season)
    rc.run()
    print(rc.rows)

def main():
    test_institutionalDailyTradingCrawler()
    #test_profitCrawler()
    #test_stockQuotesCrawler()
    #test_revenueCrawler()

if __name__ == '__main__':
    main()

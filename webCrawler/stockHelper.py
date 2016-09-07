# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------
feature list:
    * 
    * 
    * 

---------------------------------------------------------------------------------------------------------------------------------------'''
import datetime
import requests
import petl
from lxml import html

from utility import web_util, date_util
from webCrawler import stockCrawler, webTableCrawler

PERIOD = ['day', 'week', 'month', 'quater']
PATH_TRANSFORM = 'data/'

def crawl_revenue_tse(str_month='201607'):
    year, month = int(str_month[:4])-1911, int(str_month[5:])
    outfile = str_month + '-t' + '.csv'
    url = 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html'.format(year, month)

    #otc
    url = 'http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_0.html'.format(year, month)
    #thead = el.xpath('//tr[2]/th[@class="tt"]/text()[1]')[:10]
    #tbody = el.xpath('//tr[@align="right"]')  #td/text()

    xheader = '//tr[2]/th[@class="tt"]/text()[1]'
    xbody = '//tr[@align="right"]'
    sc = webTableCrawler.webHtmlTableCrawler(url=url, outfile=outfile, encode='Big5', xheader=xheader, xbody=xbody)
    sc.run()
    return (sc.rows)


def crawl_goodinfo(url):
    url = 'http://goodinfo.tw/stockinfo/StockList.asp?SHEET={}&MARKET_CAT={}&INDUSTRY_CAT={}&RPT_TIME={}'
    url = url.format(['營收狀況', '熱門排行', '營收年增率', '201607'])
    xheader = '//*[@id="txtStockListData"]/div/table/tbody'
    #query_string = 'SHEET=營收狀況&MARKET_CAT=熱門排行&INDUSTRY_CAT=營收年增率'


def crawl_wespai(url='http://stock.wespai.com/', outfile='out.csv'):
    xheader = '//*[@id="example"]/thead/tr/th/text()'
    xbody ='//*[@id="example"]/tbody/tr'
    sc = webTableCrawler.webHtmlTableCrawler(url=url, outfile=outfile, xheader=xheader, xbody=xbody)
    sc.run()
    return(sc.rows)
    #return (sc.get_table())


def crawl_exwright(year=105):
    url = 'http://stock.wespai.com/rate{}'.format(year)
    outfile = 'rate_{}.csv'.format(year)
    return (crawl_wespai(url=url, outfile=outfile))


def crawl_monthly_revenue(from_month, to_month):
    dm = date_util.month_range(from_month, to_month)
    for m in dm:
        print('Crawling {}...'.format(m))
        rc = stockCrawler.revenueCrawler(monthly=m)
        rc.run()
        print(rc.rows)


def crawl_historical_quotes(start_date='20160701', end_date='20160703'):
    dd = date_util.date_range(start_date, end_date)
    rc = stockCrawler.stockQuotesCrawler()
    for d in dd:
        date_str = d.strftime('%Y%m%d')
        print('Crawling {} '.format(date_str))

        rc.run(date_str)
        print(rc.rows)


def crawl_quarterly_profit(start_q='200701', end_q='201602'):
    dlist = date_util.quarter_range(start_q, end_q)

    for d in dlist:
        year, quarter = d[:4], d[4:]
        rc = stockCrawler.profitCrawler(year, quarter)
        rc.run()
        print(rc.rows)

def crawl_institutionalDailyTrading(trade_date=None):
    trade_date = datetime.today().strftime('%Y%m%d') if trade_date is None else trade_date
    rc = stockCrawler.institutionalDailyTradingCrawler(trade_date)
    rc.run()
    return (rc.rows)

def crawl_institutionalTrading(start_date='20160701', end_date='20160703'):
    dd = date_util.date_range(start_date, end_date)
    for d in dd:
        date_str = d.strftime('%Y%m%d')
        print('Crawling {} '.format(date_str))
        rows = crawl_institutionalDailyTrading(date_str)
        print(rows)

def crawl_stockHoldingStructure(trade_date=None):
    trade_date = datetime.today().strftime('%Y%m%d') if trade_date is None else trade_date
    rc = stockCrawler.institutionalDailyTradingCrawler(trade_date)
    rc.run()
    return (rc.rows)


def test_get_revenue():
    start_month, end_month = '201101', '201112'
    # start_month, end_month = '201310', '201601'
    # print(crawl_revenue_monthly(start_month))
    crawl_monthly_revenue(start_month, end_month)


def main():
    crawl_institutionalTrading('20160804', '20160829')
    #crawl_quarterly_profit('201601', '201602')
    #crawl_monthly_revenue('201101', '201606')
    #crawl_monthly_revenue('201607', '201607')
    #crawl_historical_quotes('20160822', '20160822')
    #print(crawl_exwright())

if __name__ == '__main__':
    main()

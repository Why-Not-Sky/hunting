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
import datetime
import requests
from lxml import html
import petl as etl

from utility import web_util
from webCrawler import stockCrawler, webTableCrawler

PERIOD = ['day', 'week', 'month', 'quater']
PATH_TRANSFORM = 'data/'

def get_revenue_otc(str_month='201607'):
    year, month = int(str_month[:4])-1911, int(str_month[5:])
    outfile = str_month + '-o' + '.csv'
    url = 'http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_0.html'.format(year, month)
    #web_util.save_html(url, outfile)

    r = requests.get(url)
    el = html.fromstring(r.content)

    '/html/body/center/center/table[2]/tbody/tr[2]/td/table/tbody/tr[3]'
    xbody = '//tr[@align="right"]'
    sc = webTableCrawler.webHtmlTableCrawler(url=url, outfile=outfile, encode='Big5', xheader=xheader, xbody=xbody)
    sc.run()
    return (sc.rows)

def get_revenue_tse(str_month='201607'):
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

def get_goodinfo(url):
    url = 'http://goodinfo.tw/stockinfo/StockList.asp?SHEET={}&MARKET_CAT={}&INDUSTRY_CAT={}&RPT_TIME={}'
    url = url.format(['營收狀況', '熱門排行', '營收年增率', '201607'])
    xheader = '//*[@id="txtStockListData"]/div/table/tbody'
    #query_string = 'SHEET=營收狀況&MARKET_CAT=熱門排行&INDUSTRY_CAT=營收年增率'

def get_wespai(url='http://stock.wespai.com/', outfile='out.csv'):
    xheader = '//*[@id="example"]/thead/tr/th/text()'
    xbody ='//*[@id="example"]/tbody/tr'
    sc = webTableCrawler.webHtmlTableCrawler(url=url, outfile=outfile, xheader=xheader, xbody=xbody)
    sc.run()
    return(sc.rows)
    #return (sc.get_table())

def get_historical_quotes(trade_date='20160701'):
    tse = stockCrawler.get_historical_quotes_tse(trade_date=trade_date)
    otc = stockCrawler.get_historical_quotes_otc(trade_date=trade_date)

    table = etl.stack(tse, otc)
    return(table)

def get_exwright(year=105):
    url = 'http://stock.wespai.com/rate{}'.format(year)
    outfile = 'rate_{}.csv'.format(year)
    return (get_wespai(url=url, outfile=outfile))

def main():
    print(get_historical_quotes())
    print(get_revenue_tse())
    print(get_exwright())

if __name__ == '__main__':
    main()

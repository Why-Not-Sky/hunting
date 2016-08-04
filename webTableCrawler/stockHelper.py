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
import petl as etl
import webTableCrawler
import stockCrawler as stockCrawler

PERIOD = ['day', 'week', 'month', 'quater']
PATH_TRANSFORM = 'data/'

def get_historical_quotes(trade_date='20160701'):
    tse = stockCrawler.get_historical_quotes_tse(trade_date=trade_date)
    otc = stockCrawler.get_historical_quotes_otc(trade_date=trade_date)

    table = etl.stack(tse, otc)
    return(table)

def test_get_historical_quotes(trade_date='20160701'):
    print(get_historical_quotes())

def get_wespai(url, outfile):
    xheader = '//*[@id="example"]/thead/tr/th/text()'
    xbody ='//*[@id="example"]/tbody/tr'
    sc = webTableCrawler.webHtmlTableCrawler(url=url, outfile=outfile, xheader=xheader, xbody=xbody)
    return (sc.get_table())

def get_exwright(year=105):
    url = 'http://stock.wespai.com/rate{}'.format(year)
    outfile = 'rate_{}.csv'.format(year)
    return (get_wespai(url=url, outfile=outfile))

def test_get_wespai():
    today = datetime.date.today().strftime('%Y%m%d')
    url, outfile = 'http://stock.wespai.com/p/20494', '{}-ROE.CSV'.format(today)
    print (get_wespai(url=url, outfile=outfile))

def test_get_exwright(year=105):
    print(get_exwright(year))

def main():
    test_get_wespai()
    test_get_exwright()
    test_get_historical_quotes()
    print(get_historical_quotes())

if __name__ == '__main__':
    main()

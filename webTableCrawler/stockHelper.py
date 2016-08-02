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

HEADLINE_RATE_105 = '代號,公司,扣抵稅率,配息,除息日,配股,除權日,股價,現金殖利率,殖利率,還原殖利率,發息日,配息率,董監持股,3年平均股利,6年平均股利,10年平均股利,10年股利次數,1QEPS,2QEPS,3QEPS,今年累積EPS,去年EPS,本益比,股價淨值比,5%每萬元買抵稅,5%持有一張抵稅,12%萬買,12%一張,20%萬買,20%一張,30%萬買,30%一張,多少張以上要繳健保費,一張繳健保費'
HEADER_RATE_105 = HEADLINE_RATE_105.split(',')
XPATH_HEADER = '//*[@id="example"]/thead/tr/th/text()' # for 'http://stock.wespai.com/rate{}'
XPATH_BODY = '//*[@id="example"]/tbody/tr'   # for

def get_wespai(url, outfile):
    sc = webTableCrawler(url=url, xheader=XPATH_HEADER, xbody=XPATH_BODY, outfile=outfile)
    sc.run()
    print(sc.rows)

def get_exwright(year=105):
    url, outfile = URL_RATE.format(year), CSV_RATE.format(year)
    get_wespai(url, outfile)

def test_get_wespai():
    today = datetime.date.today().strftime('%Y%m%d')
    url, outfile = 'http://stock.wespai.com/p/20494', PATH + ('{}-ROE.CSV').format(today)
    get_wespai(url=url, outfile=outfile)

def test_get_exwright(year=105):
    get_exwright(year)

def main():
    pass


if __name__ == '__main__':
    main()
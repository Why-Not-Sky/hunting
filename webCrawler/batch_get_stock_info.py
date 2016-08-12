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
import stockHelper as crawler
import datetime

def get_wespai(url=None, outfile=None):
    print(crawler.get_wespai(url, outfile))

'''---------------
價值面：
    經營資訊
        月營收資料
'''

def get_revenue_monthly(month='201607'):
    'http://mops.twse.com.tw/nas/t21/sii/t21sc03_104_4_0.html'
    pass

def get_roe():
    today = datetime.date.today().strftime('%Y%m%d')
    url, outfile = 'http://stock.wespai.com/p/20494', '{}-ROE.CSV'.format(today)
    print (crawler.get_wespai(url=url, outfile=outfile))

def get_exwright(year=105):
    print (crawler.get_exwright(year=year))

url_wespai = 'http://stock.wespai.com/'

list_stock_info = [
    dict(name='roe', site=url_wespai, method=get_roe, args={}),
    dict(name='exwright', site=url_wespai, method=get_exwright, args={
        'year': 105
    }),
    dict(name='殖利率', site=url_wespai, method=get_wespai, args={
        'url': 'http://stock.wespai.com/rate105'
        ,'outfile': 'rate_105.csv'
    })
]

def start_crawler():
    for jb in list_stock_info: #[2:]:
        print('job: {} starting...'.format(jb['name']))
        method = jb['method']
        args = jb['args']
        method(**args)

def main():
    start_crawler()

if __name__ == '__main__':
    main()
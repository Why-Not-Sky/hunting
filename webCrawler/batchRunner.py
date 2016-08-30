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
import argparse
import configparser
import logging
import os
from datetime import date, timedelta

from utility import date_util as util
from webCrawler import stockHelper as crawler

_CONFIG_FILE = 'crawler.cfg'

def get_wespai(url=None, outfile=None):
    print(crawler.crawl_wespai(url, outfile))

'''---------------
價值面：
    經營資訊
        月營收資料
'''


class batchRunner():
    def __init__(self, prefix="data", origin="origin", section_name=None, config_name=None):
        # Set logging
        if not os.path.isdir('log'):
            os.makedirs('log')
        logging.basicConfig(filename='log/crawl-error.log',
                            level=logging.ERROR,
                            format='%(asctime)s\t[%(levelname)s]\t%(message)s',
                            datefmt='%Y/%m/%d %H:%M:%S')
        self._section_name = section_name
        self._config_name = config_name

    def run(self, dlist=[], method=None, args={}):
        max_error = 1000
        error_times = 0

        for d in dlist:
            try:
                method(d, **args)
                #self._write_execution_log(date_str)
                print('Crawling {} done! '.format(d))
                error_times = 0
            except:
                logging.error('Run raise error {}'.format(d))
                error_times += 1
                if (error_times < max_error):
                    continue
                else:
                    break

def get_roe():
    today = datetime.date.today().strftime('%Y%m%d')
    url, outfile = 'http://stock.wespai.com/p/20494', '{}-ROE.CSV'.format(today)
    print (crawler.crawl_wespai(url=url, outfile=outfile))

def get_exwright(year=105):
    print (crawler.crawl_exwright(year=year))

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

def test_batchRunner():
    jb = batchRunner()
    #jb.run(list(range(103, 105)), get_exwright)

    jb.run(util.date_range('20160804', '20160829', 's'), crawler.crawl_institutionalDailyTrading)

def main():
    test_batchRunner()
    #start_crawler()

if __name__ == '__main__':
    main()
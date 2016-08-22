# -*- coding: utf-8 -*-

"""---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
--------------------------------------------------------------------
1.1d    2016/07/26 	    產生crawl2，整理輸入輸出，提供批次
1.1d    2016/07/27      refactoring to webCrawler, date_util
                        issue:  open 'rb' is error as reading as json
                                try..except doesn't raise error in debugger


------------------------------------------------------------------------------------------------------------------------------------------
non-function requirement:
    * add unit test
    * implement by etl library: pets, odo, or tab…(@2016/07/27)
    * add exception handling: by AOP framework
    * refactor by inheritance (@2016/07/27)
    * refactor by IoC

------------------------------------------------------------------------------------------------------------------------------------------
feature list:
    * add filter to exclude untracked symbol
    * crawling target
        - personal investment
            > portfolio current stock
            > trading history
            > wish list
        - company: basic/finance/...
            > company revenue...
        - market information
            > news
            > industry/ chain/ group
            >
    * crawling only if the trade market open
    * calculate moving average
    * implement technical analysis library
---------------------------------------------------------------------------------------------------------------------------------------"""

import argparse
import configparser
import logging
import os
from datetime import date, timedelta

from utility import date_util as util
from webCrawler import stockCrawler as crawler

_CONFIG_FILE = 'crawler.cfg'

class Crawler():
    def __init__(self, prefix="data", origin = "origin"):
        # Set logging
        if not os.path.isdir('log'):
            os.makedirs('log')
        logging.basicConfig(filename='log/crawl-error.log',
                            level=logging.ERROR,
                            format='%(asctime)s\t[%(levelname)s]\t%(message)s',
                            datefmt='%Y/%m/%d %H:%M:%S')

    def run(self, start_date=None, end_date=None):
        if start_date is None:
            start_date, end_date = self.get_duration()

        max_error = 1000
        error_times = 0

        sq = crawler.stockQuotesCrawler()

        #tse = crawler.tseCrawler()

        dlist = util.date_range(start_date, end_date)

        for d in dlist:
            date_str = d.strftime('%Y%m%d')

            try:
                sq.run(date_str)
                #tse.run(date_str)
                self._write_execution_log(date_str)
                print('Crawling {} done! '.format(date_str))
                error_times = 0
            except:
                logging.error('Crawl raise error {}'.format(date_str))
                error_times += 1
                if (error_times < max_error): continue
                else: break

    def _write_execution_log(self, date_str):
        #todo: update the config
        self._update_last_run(date_str)
        pass

    def _get_from_arguments(self):
        parser = argparse.ArgumentParser(description='Crawl data at assigned day')
        parser.add_argument('day', type=int, nargs='*',
                            help='assigned day (format: YYYYMMDD), default is today')  # end_date

        args = parser.parse_args()
        from_day, to_day = None, None

        # Day only accept 0 or 3 arguments
        if len(args.day) >= 1:
            from_day = str(args.day[0])
            to_day = str(args.day[1]) if len(args.day) == 2 else from_day

        return from_day, to_day

    def _update_last_run(self, last_date):
        config = configparser.RawConfigParser()
        cfgfile = open(_CONFIG_FILE, 'w')

        config.add_section('TaiwanStcok')
        config.set('TaiwanStcok', 'last_date', last_date)
        config.write(cfgfile)
        cfgfile.close()

    def _get_from_config(self):
        config = configparser.RawConfigParser()
        cfgfile = _CONFIG_FILE
        config.read(cfgfile)

        last_date = config.get("TaiwanStcok", "last_date")
        from_day = util.date_str_add(last_date)
        to_day =  date.today().strftime('%Y%m%d')

        return from_day, to_day

    def get_duration(self):
        # get from the arguments first
        from_day, to_day = self._get_from_arguments()

        # get from the config
        if (from_day is None):
            from_day, to_day = self._get_from_config()

        # if none, default is today
        if (from_day is None):
            from_day = date.today().strftime('%Y%m%d')
            to_day = from_day

        return (from_day, to_day)

def main():
    '''
      args: crawl [start_date:yyyymmdd] [end_date:yyyymmdd]
      ex: crawl 20160701 20160712
    '''
    crawler = Crawler()
    crawler.run()
    #crawler.run('20160101', '2016730')
    #otc only data from 20070423
    #crawler.run('20000120', '20041231')
    #crawler.run('20070101', '20070423')

if __name__ == '__main__':
    main()
    #test_download_all('20160712', '20160713')



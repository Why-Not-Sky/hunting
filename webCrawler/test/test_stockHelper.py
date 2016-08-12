import unittest
import datetime

from webCrawler import stockHelper

class MyTestCase(unittest.TestCase):
    def test_something(self):
        self.assertEqual(True, False)

    def test_get_wespai():
        today = datetime.date.today().strftime('%Y%m%d')
        url, outfile = 'http://stock.wespai.com/p/20494', '{}-ROE.CSV'.format(today)
        print (stockHelper.get_wespai(url=url, outfile=outfile))

    def test_get_exwright(year=105):
        print(stockHelper.get_exwright(year))

    def test_get_revenue_all(month='201607'):
        print(stockHelper.get_revenue_all(str_month=month))

    def test_get_historical_quotes(trade_date='20160701'):
        print(stockHelper.get_historical_quotes())

if __name__ == '__main__':
    unittest.main()

import unittest

class TestTseCrawler(unittest.TestCase):
    def test___init__(self):
        # tse_crawler = tseCrawler(trade_date, short)
        assert False # TODO: implement your test here

    def test_get_header(self):
        # tse_crawler = tseCrawler(trade_date, short)
        # self.assertEqual(expected, tse_crawler.get_header())
        assert False # TODO: implement your test here

class TestOtcCrawler(unittest.TestCase):
    def test___init__(self):
        # otc_crawler = otcCrawler(trade_date, short)
        assert False # TODO: implement your test here

    def test_get_header(self):
        # otc_crawler = otcCrawler(trade_date, short)
        # self.assertEqual(expected, otc_crawler.get_header())
        assert False # TODO: implement your test here

class TestExtract(unittest.TestCase):
    def test_extract(self):
        # self.assertEqual(expected, extract(self))
        assert False # TODO: implement your test here

class TestTransform(unittest.TestCase):
    def test_transform(self):
        # self.assertEqual(expected, transform(self))
        assert False # TODO: implement your test here

class TestLoad(unittest.TestCase):
    def test_load(self):
        # self.assertEqual(expected, load(self, trade_date, is_delete))
        assert False # TODO: implement your test here

class TestRun(unittest.TestCase):
    def test_run(self):
        # self.assertEqual(expected, run(self, *args, **kwargs))
        assert False # TODO: implement your test here

class TestStockQuotesCrawler(unittest.TestCase):
    def test___init__(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        assert False # TODO: implement your test here

    def test_extract(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        # self.assertEqual(expected, stock_quotes_crawler.extract(trade_date))
        assert False # TODO: implement your test here

    def test_get_historical_quotes(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        # self.assertEqual(expected, stock_quotes_crawler.crawl_historical_quotes())
        assert False # TODO: implement your test here

    def test_load(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        # self.assertEqual(expected, stock_quotes_crawler.load(trade_date, is_delete))
        assert False # TODO: implement your test here

    def test_run(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        # self.assertEqual(expected, stock_quotes_crawler.run(trade_date))
        assert False # TODO: implement your test here

    def test_set_trade_date(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        # self.assertEqual(expected, stock_quotes_crawler.set_trade_date(trade_date))
        assert False # TODO: implement your test here

    def test_transform(self):
        # stock_quotes_crawler = stockQuotesCrawler(trade_date)
        # self.assertEqual(expected, stock_quotes_crawler.transform(trade_date))
        assert False # TODO: implement your test here

class TestRevenueCrawler(unittest.TestCase):
    def test___init__(self):
        # revenue_crawler = revenueCrawler(monthly)
        assert False # TODO: implement your test here

    def test_load(self):
        # revenue_crawler = revenueCrawler(monthly)
        # self.assertEqual(expected, revenue_crawler.load())
        assert False # TODO: implement your test here

    def test_to_big5(self):
        # revenue_crawler = revenueCrawler(monthly)
        # self.assertEqual(expected, revenue_crawler.to_big5())
        assert False # TODO: implement your test here

    def test_transform(self):
        # revenue_crawler = revenueCrawler(monthly)
        # self.assertEqual(expected, revenue_crawler.transform())
        assert False # TODO: implement your test here

class TestGetRevenue(unittest.TestCase):
    def test_get_revenue(self):
        # self.assertEqual(expected, crawl_monthly_revenue(from_month, to_month))
        assert False # TODO: implement your test here

class TestGetHistoricalQuotes(unittest.TestCase):
    def test_get_historical_quotes(self):
        # self.assertEqual(expected, crawl_historical_quotes(trade_date))
        assert False # TODO: implement your test here

class TestTestStockQuotes(unittest.TestCase):
    def test_test_stock_quotes(self):
        # self.assertEqual(expected, test_stockQuotes())
        assert False # TODO: implement your test here

class TestTestGetRevenue(unittest.TestCase):
    def test_test_get_revenue(self):
        # self.assertEqual(expected, test_get_revenue())
        assert False # TODO: implement your test here

if __name__ == '__main__':
    unittest.main()

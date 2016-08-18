import unittest
from lxml import html
from os import path

from utility import web_util
#import utility.web_util

class TestSaveHtml(unittest.TestCase):
    def setUp(self):
        self.html_file = 'rate_105.html'
        self.url = 'http://stock.wespai.com/rate105'

    def test_save_html(self):
        expected = 'ascii'
        self.assertEqual(expected, web_util.save_html(self.url, self.html_file))
        assert path.isfile(self.html_file) and path.getsize(self.html_file) > 10

class TestGetFromFile(unittest.TestCase):
    def test_get_from_file(self):
        # self.assertEqual(expected, get_from_file(html_file))
        # assert False # TODO: implement your test here
        pass

class TestGetEtree(unittest.TestCase):
    def test_get_etree(self):
        # self.assertEqual(expected, get_etree(html_file))
        # assert False # TODO: implement your test here
        pass

class TestGetHeader(unittest.TestCase):
    def setUp(self):
        self.html_file = 'rate_105.html'
        self.url = 'http://stock.wespai.com/rate105'
        self.xheader = '//*[@id="example"]/thead/tr/th/text()'

    def test_get_header(self):
        encode = web_util.save_html(self.url, self.html_file)

        expected = ['代號', '公司', '扣抵稅率', '配息', '除息日', '配股', '除權日', '股價', '現金殖利率', '殖利率', '還原殖利率', '發息日', '配息率', '董監持股', '3年平均股利', '6年平均股利', '10年平均股利', '10年股利次數', '1QEPS', '2QEPS', '3QEPS', '今年累積EPS', '去年EPS', '本益比', '股價淨值比', '5%每萬元買抵稅', '5%持有一張抵稅', '12%萬買', '12%一張', '20%萬買', '20%一張', '30%萬買', '30%一張', '多少張以上要繳健保費', '一張繳健保費']
        self.assertEqual(expected, web_util.get_header(self.html_file, self.xheader))

        # xheader = '//*[@id="example_wrapper"]//tr[@role="row"]/text()'
        # print(get_header(html_file, xheader=xheader))

class TestGetData(unittest.TestCase):
    def setUp(self):
        self.html_file = 'rate_105.html'
        self.url = 'http://stock.wespai.com/rate105'
        self.xheader = '//*[@id="example"]/thead/tr/th/text()'

    def test_get_data(self):
        encode = 'ascii'
        expected = []

        #self.assertEqual(expected, web_util.get_data(self.html_file, encode))

    def test_if_encode_affect(self):
        encode = 'ascii'
        expected = web_util.get_data(self.html_file, encode)

        encode = 'utf-8'
        #self.assertEqual(expected, web_util.get_data(self.html_file, encode))


class TestGetFromUrl(unittest.TestCase):
    def setUp(self):
        self.html_file = 'rate_105.html'
        self.url = 'http://stock.wespai.com/rate105'

    def test_get_from_url(self):
        # self.assertEqual(expected, get_from_url(url))
        self.assertIsNotNone(web_util.get_from_url(self.url))

class TestGetText(unittest.TestCase):
    def setUp(self):
        html_text = '<td><a href="http://tw.stock.yahoo.com/d/s/dividend_0050.html" target="_blank">台灣50</a></td><td><a href="" title="0050-歷年扣抵率" rel="rate" class="chart">0%</a></td><td><a href="" title="0050-歷年股利" class="rate">0.85</a></td><td>07/28</td><td> </td>'
        self.el = html.fromstring(html_text)

    def test_get_text(self):
        ele = self.el.xpath('td')[0]
        expected = '台灣50'
        self.assertEqual(expected, web_util.get_text(ele))

class TestParseText(unittest.TestCase):
    def test_parse_text(self):
        # self.assertEqual(expected, parse_text(td))
        # assert False # TODO: implement your test here
        pass


class TestGetAllTexts(unittest.TestCase):
    def test_get_all_texts(self):
        # self.assertEqual(expected, get_all_texts(el, class_name))
        # assert False # TODO: implement your test here
        pass


if __name__ == '__main__':
    unittest.main()

import unittest

class MyTestCase(unittest.TestCase):
    def test_something(self):
        self.assertEqual(True, False)

def tse_transform(row=None): #, date_str=None):
    #to-do: use dynamic arguments
    sign = '-' if len(row[9]) == 1 and row[9] in ['-', u'－'] else ''
    change = sign + row[10]
    return(row[0], row[1], row[4], row[5], row[6], row[7], row[8], change, row[3])
    #return r

def test_tseCralwer(date_str='20160701'):
    """
    with standard clean & transform rules enabled
    :return:
    """
    tse = tseCrawler(trade_date=date_str)
    dest_table = tse.get_table()

    dest_table = etl.headers.setheader(dest_table,  _HEADER)
    dest_table = etl.transform.conversions.convert(dest_table
                                                   , {'trade_date': lambda v, row: date_str}
                                                   , pass_row=True)  # cause _trade_date not worked --> need row values

    return (etl.sort(dest_table, 0))

def test_tseTransform(date_str='20160701'):
    outdate = to_taiwan_date(date_str)
    url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL".format(outdate)
    outfile = PATH + ('{}-t.csv').format(date_str)
    xheader = '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  #'//*[@id="main-content"]/table[2]/thead/tr[2]'
    xbody = '//table[2]/tbody/tr'  #loop for td to get the table content

    src_table = webTableCrawler(url=url, xheader=xheader, xbody=xbody, outfile=outfile).get_table()

    #using etl to transform
    dest_table = etl.headers.setheader(src_table, _ENGLISH_HEADER)  # _CHINESE_HEADER) #_ENGLISH_HEADER) # _CHINESE_HEADER)
    dest_table = etl.cut(dest_table, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 3)
    dest_table = etl.rename(dest_table, 'name', 'trade_date')

    f_clean = lambda x: clean_number(x)
    dest_table = etl.transform.conversions.convertall(dest_table, f_clean)

    dest_table = etl.transform.conversions.convert(dest_table
                                                    , {'trade_date': lambda v, row: date_str
                                                    , 'change': lambda v, row: ('-' + v) if (len(row.sign) == 1 and (row.sign[0] in ['-', u'－'])) else v
                                                    }
                                                    , pass_row=True)  # cause _trade_date not worked --> need row values

    dest_table = etl.cutout(dest_table, 'sign')
    return (etl.sort(dest_table, 0))

#orign helper services
def get_exwright_origin(year=105):
    URL = URL_RATE.format(year)
    HTML_FILE = HTML_RATE.format(year)
    CSV_FILE = CSV_RATE.format(year)
    web_util.save_html(URL, HTML_FILE)

    doc = web_util.get_from_file(HTML_FILE)
    #doc = clean_html(doc)
    f_parse = lambda x: web_util.get_text(x)

    elist = doc.xpath('//*[@id="example"]/tbody/tr')        # //*[@id="example"]/tbody/tr[1]/td[2]  --
    table = [map(f_parse, el.xpath('td')) for el in elist]  # loop to get each rows

    # hard coding header for rate 105
    table = etl.headers.pushheader(table, HEADER_RATE_105)
    table = etl.sort(table, 0)
    etl.tocsv(table, CSV_FILE, encoding='utf8')

    print(table)

def test_get_header():
    url = URL_RATE.format(105)
    sc = webTableCrawler(url=url)
    sc.get_doc()
    #xheader = '//*[@id="example"]/thead/tr/th'
    #print(sc.get_header(xheader=xheader))

    xheader = '//*[@id="example"]/thead/tr/th/text()'
    sc.get_header(xheader=xheader)
    print(sc.header)

def test_get_tse(outdate='20160701'):
    transform_table = test_tseTransform(outdate)
    print('transform tse through outside clean & transform rules... ')
    print(transform_table)

    print('transform tse using build-in function... ')

    build_in_table = test_tseCralwer(outdate)
    print(build_in_table)

    outfile = PATH + ('{}-t.csv').format(outdate.replace('/', ''))
    etl.tocsv(build_in_table, outfile)

def main():
    test_get_header()
    #test_get_exwright(105)
    #test_get_wespai()
    #test_get_tse()

class TestGetRawData(unittest.TestCase):
    def test_get_raw_data(self):
        # self.assertEqual(expected, get_raw_data(self))
        assert False # TODO: implement your test here

class TestWebTableCrawler(unittest.TestCase):
    def test___init__(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        assert False # TODO: implement your test here

    def test_get_body(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.get_body(xbody))
        assert False # TODO: implement your test here

    def test_get_doc(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.get_doc(url, infile))
        assert False # TODO: implement your test here

    def test_get_header(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.get_header())
        assert False # TODO: implement your test here

    def test_get_row(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.get_row(el))
        assert False # TODO: implement your test here

    def test_get_rows(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.get_rows())
        assert False # TODO: implement your test here

    def test_get_table(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.get_table())
        assert False # TODO: implement your test here

    def test_run(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.run())
        assert False # TODO: implement your test here

    def test_save(self):
        # web_table_crawler = webTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform)
        # self.assertEqual(expected, web_table_crawler.save())
        assert False # TODO: implement your test here

class TestWebHtmlTableCrawler(unittest.TestCase):
    def test___init__(self):
        # web_html_table_crawler = webHtmlTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        assert False # TODO: implement your test here

    def test_get_doc(self):
        # web_html_table_crawler = webHtmlTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_html_table_crawler.get_doc(url, infile))
        assert False # TODO: implement your test here

    def test_get_header(self):
        # web_html_table_crawler = webHtmlTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_html_table_crawler.get_header(xheader))
        assert False # TODO: implement your test here

    def test_get_row(self):
        # web_html_table_crawler = webHtmlTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_html_table_crawler.get_row(el))
        assert False # TODO: implement your test here

    def test_get_rows(self):
        # web_html_table_crawler = webHtmlTableCrawler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_html_table_crawler.get_rows(xbody))
        assert False # TODO: implement your test here

class TestWebJsonTableCarwler(unittest.TestCase):
    def test___init__(self):
        # web_json_table_carwler = webJsonTableCarwler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        assert False # TODO: implement your test here

    def test_get_doc(self):
        # web_json_table_carwler = webJsonTableCarwler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_json_table_carwler.get_doc(url, infile))
        assert False # TODO: implement your test here

    def test_get_row(self):
        # web_json_table_carwler = webJsonTableCarwler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_json_table_carwler.get_row(el))
        assert False # TODO: implement your test here

    def test_get_rows(self):
        # web_json_table_carwler = webJsonTableCarwler(url, outfile, encode, reload, fn_clean, cols_to_clean, fn_transform, xheader, xbody)
        # self.assertEqual(expected, web_json_table_carwler.get_rows())
        assert False # TODO: implement your test here

class TestTestWebTableCrawler(unittest.TestCase):
    def test_test_web_table_crawler(self):
        # self.assertEqual(expected, test_webTableCrawler())
        assert False # TODO: implement your test here

class TestTestWebHtmlTableCrawler(unittest.TestCase):
    def test_test_web_html_table_crawler(self):
        # self.assertEqual(expected, test_webHtmlTableCrawler(dict))
        assert False # TODO: implement your test here

class TestGetTseDict(unittest.TestCase):
    def test_get_tse_dict(self):
        # self.assertEqual(expected, get_tse_dict(trade_date))
        assert False # TODO: implement your test here

class TestGetTse(unittest.TestCase):
    def test_get_tse(self):
        # self.assertEqual(expected, get_tse(trade_date))
        assert False # TODO: implement your test here

class TestGetOtcDict(unittest.TestCase):
    def test_get_otc_dict(self):
        # self.assertEqual(expected, get_otc_dict(trade_date))
        assert False # TODO: implement your test here

class TestTestWebJsonTableCarwler(unittest.TestCase):
    def test_test_web_json_table_carwler(self):
        # self.assertEqual(expected, test_webJsonTableCarwler())
        assert False # TODO: implement your test here

class TestGetOtc(unittest.TestCase):
    def test_get_otc(self):
        # self.assertEqual(expected, get_otc(trade_date))
        assert False # TODO: implement your test here

if __name__ == '__main__':
    unittest.main()

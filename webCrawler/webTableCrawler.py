# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
function:
    get the taiwan trade information from http://stock.wespai.com/rate105
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
0.1     2016/07/31      refactor from xpath-stock.py
                    # <td><a href="http://tw.stock.yahoo.com/d/s/dividend_1101.html" target="_blank">台泥</a></td>
0.11    2016/08/02      default is for html, then turn to support json fiile

------------------------------------------------------------------------------------------------------------------------------------------
non-function requirement: 
    * 
    * 
    *
------------------------------------------------------------------------------------------------------------------------------------------
feature list:
    * write the result into excel/ google sheet/ database
    * 
    *
---------------------------------------------------------------------------------------------------------------------------------------'''
import os.path
import petl as etl
from os import mkdir
from os.path import isdir
from lxml import html
import time
import json

from utility import web_util
from utility import date_util

PATH_RAW = 'raw/'
PATH_TRANSFORM = 'data/'
XPATH_HEADER = '//table[0]/thead/tr/th/text()'
XPATH_BODY = '//table[0]//tbody/tr'
_OUTPUT_CSV_FILE = 'output.csv'
_OUTPUT_HTML_FILE = 'output.html'

class WebCrawler():
    def __init__(self, url, rawfile=None, encode='utf-8', reload=False, raw_path=PATH_RAW, data_path=PATH_TRANSFORM):
        ''' Make directory if not exist when initialize '''
        if not isdir(raw_path): mkdir(raw_path)
        self.raw_path = raw_path

        if not isdir(data_path): mkdir(data_path)
        self.data_path = data_path

        self.url = url
        self.rawfile = rawfile if rawfile is not None else _OUTPUT_HTML_FILE
        self.reload = reload
        self.encode = encode          #default is utf-8, and adapted according the file stream
        self.rawdata = self.get_raw_data()
        #self.postfix = ''
        #self._connection = None

    def _save_raw_data(self, url=None, sfile=None):
        sfile = sfile if (sfile is not None) else self.rawfile

        if (self.reload) or (not os.path.exists(sfile)):
            url = url if (url is not None) else self.url
            self.encode = web_util.save_html(url, sfile)

    def get_raw_data(self):
        sfile = '' if self.raw_path is None else self.raw_path + self.rawfile
        self._save_raw_data(self.url, sfile)
        return(web_util.get_data(sfile, encode=self.encode))

class webTableCrawler(WebCrawler):
    def  __init__(self, url=None, outfile=None, encode='utf-8', reload=False, fn_clean=None, fn_transform=None):
        outfile= outfile if (outfile is not None) else _OUTPUT_CSV_FILE
        rawfile = outfile.lower().replace('.csv', '.html')

        super(webTableCrawler, self).__init__(url=url, rawfile=rawfile, encode=encode, reload=reload)

        self.datafile = '' if self.data_path is None else self.data_path + outfile
        self.doc = self.get_doc()
        self.rows = None
        self.header = None
        self.cell_clean =  fn_clean if (fn_clean is not None) else self._do_nothing
        self.row_transform = fn_transform if (fn_transform is not None) else self._do_nothing
        #self.filter = fn_filter if (fn_filter is not None) else self._do_nothing

    def _do_nothing(self, x):
        return(x)

    def get_doc(self, url=None, infile=None):
        pass
        #return self.doc

    def get_header(self):
        pass #return self.header

    def get_rows(self):
        pass #return self.rows

    def get_row(self, el):
        pass

    def get_body(self, xbody=None):
        if (self.header is None): self.get_header()

        elist = self.get_rows()  # //*[@id="example"]/tbody/tr[1]/td[2]  --
        if elist is None: return None

        # clean the column dataa
        fn_clean = lambda x: self.cell_clean(x)  #(web_util.get_text(x))
        #fn_transform = lambda r: self.row_transform(r)

        if self.row_transform is None:
            table = [map(fn_clean, self.get_row(el)) for el in elist]  # loop to get each rows
        else:
            table = []  # loop to get each rows
            for el in elist:
                r = self.row_transform(self.get_row(el))
                r = list(map(fn_clean, r))
                table.append(r)

        return (table)

    def get_table(self):
        table = self.get_body()
        if (table is not None) and (len(table) > 0):
            if (self.header is not None):
                table = etl.headers.pushheader(table, self.header)
            table = etl.sort(table, 0)

        self.rows = table
        return self.rows

    def save(self):
        if (self.rows is not None):
            etl.tocsv(self.rows, self.datafile, encoding='utf8')

    def run(self):
        self.get_table()
        self.save()
        #logging.debug('\n{}'.format(self.rows))

class webHtmlTableCrawler(webTableCrawler):
    def __init__(self, url, outfile=None, encode='utf-8', reload=False, fn_clean=None, fn_transform=None, xheader=None, xbody=None):
        super(webHtmlTableCrawler, self).__init__(url=url, outfile=outfile, encode=encode, reload=reload, fn_clean=fn_clean, fn_transform=fn_transform)

        self.xpath_header = xheader # if (xheader is not None) else XPATH_HEADER
        self.xpath_body = xbody # if (xbody is not None) else XPATH_BODY

    def get_doc(self, url=None, infile=None):
        return (html.fromstring(self.rawdata))
        #self.doc = html.fromstring(self.rawdata) #htmlfile
        #return (self.doc)

    def get_header(self, xheader=None):
        if (self.doc is None): self.get_doc()
        xheader = xheader if (xheader is not None) else self.xpath_header
        if xheader is None: return None

        ehead = self.doc.xpath(xheader)  # pass header by '//*[@id="example"]/thead/tr/th/text()
        # work pass header '//*[@id="example"]/thead/tr/th' if special tag in header
        # f_parse = lambda x: web_util.get_text(x)
        # ehead = list(map(f_parse, self.doc.xpath(xheader)))  # //*[@id="example"]/tbody/tr[1] --

        self.header = ehead
        return (self.header)

    def get_rows(self, xbody=None):
        xbody = xbody if (xbody is not None) else self.xpath_body
        if xbody is None: return None

        return (self.doc.xpath(xbody))  # //*[@id="example"]/tbody/tr[1]/td[2]  --

    def get_row(self, el):
        # lambda x: web_util.get_text(x)
        return list(map(lambda x: web_util.get_text(x), el.xpath('td')))
        # return (el.xpath('td'))    # x = web_util.get_text(td)

class webJsonTableCarwler(webTableCrawler):
    def __init__(self, url, outfile=None, encode='utf-8', reload=False, fn_clean=None, fn_transform=None, xheader=None, xbody=None):
        super(webJsonTableCarwler, self).__init__(url=url, outfile=outfile, encode=encode, reload=reload, fn_clean=fn_clean,
                                                  fn_transform=fn_transform)

        self.xheader = xheader
        self.xbody = xbody

    def get_doc(self, url=None, infile=None):
        return (self.rawdata) # json file

    def get_rows(self):
        result = json.loads(self.doc)  # data.json()

        elist = []
        #elist = [result['mmData'], result['aaData']]
        for field in self.xbody:
            elist += result[field]

        return(elist)

    def get_row(self, el):
        return (el)

def test_webTableCrawler():
    url ='http://stock.wespai.com/rate105'
    outfile = 'rate_105.csv'
    sc = webTableCrawler(url = url, outfile = outfile)
    sc.run()
    print(sc.rows)

dict_wespai = {
    'url' : 'http://stock.wespai.com/rate105'
    ,'outfile' :  'rate_105.csv'
    ,'xheader' : '//*[@id="example"]/thead/tr/th/text()'
    ,'xbody' : '//*[@id="example"]/tbody/tr'
}

def test_webHtmlTableCrawler(dict=None):
    url = dict_wespai['url']
    outfile = dict_wespai['outfile']
    xheader = dict_wespai['xheader']
    xbody = dict_wespai['xbody']
    sc = webHtmlTableCrawler(url=url, outfile=outfile, xheader=xheader, xbody=xbody)

    sc.run()
    print(sc.rows)

def get_tse_dict(trade_date='20160701'):
    taiwan_date = date_util.to_taiwan_date(trade_date)
    return {'url': "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL".format(taiwan_date)
        , 'outfile': ('{}-t.csv').format(trade_date)
        , 'xheader': '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  #'//*[@id="main-content"]/table[2]/thead/tr[2]'
        , 'xbody': '//table[2]/tbody/tr'  #loop for td to get the table content
              }

def get_tse(trade_date='20160701'):
    dict = get_tse_dict(trade_date)
    sc = webHtmlTableCrawler(url=dict['url'], outfile=dict['outfile'], xheader=dict['xheader'], xbody=dict['xbody'])
    sc.run()
    return (sc.rows)

def get_otc_dict(trade_date='20160701'):
    taiwan_date = date_util.to_taiwan_date(trade_date)
    url = 'http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?l=zh-tw&d={}&_={}'
    ttime = str(int(time.time() * 100))

    return {'url': 'http://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?l=zh-tw&d={}&_={}'.format(taiwan_date, ttime)
        , 'outfile':  ('{}-o.csv').format(trade_date)
        , 'xheader': None
        , 'xbody': ['mmData', 'aaData']
        }

def test_webJsonTableCarwler():
    print(get_otc(trade_date='20160701'))

def get_otc(trade_date='20160701'):
    dict = get_otc_dict(trade_date)
    sc = webJsonTableCarwler(url=dict['url'], outfile=dict['outfile'], xheader=dict['xheader'], xbody=dict['xbody'])
    sc.run()
    return (sc.rows)

def main():
    test_webTableCrawler()
    test_webHtmlTableCrawler()
    get_tse()   #test_webHtmlTableCrawler
    get_otc()   #test_webJsonTableCarwler

if __name__ == '__main__':
    #logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)
    main()
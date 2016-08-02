# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
function:
    get the taiwan trade information from http://stock.wespai.com/rate105
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
0.1     2016/07/31      refactor from xpath-stock.py
                    # <td><a href="http://tw.stock.yahoo.com/d/s/dividend_1101.html" target="_blank">台泥</a></td>


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

from utility import web_util

PATH = 'data/'
XPATH_HEADER = '//table[0]/thead/tr/th/text()'
XPATH_BODY = '//table[0]//tbody/tr'
DEFAULT_OUT = PATH + 'output.csv'

class webTableCrawler():
    def  __init__(self, url=None, xheader=None, xbody=None, outfile=None, fn_clean=None, fn_transform=None, reload=False):
        self.url = url #read from file as None
        self.reload = reload
        self.outfile= outfile if (outfile is not None) else DEFAULT_OUT
        self.infile = self.outfile.lower().replace('.csv', '.html')
        self.doc = None
        self.rows = None
        self.header = None
        self.xpath_header = xheader if (xheader is not None) else XPATH_HEADER
        self.xpath_body = xbody if (xbody is not None) else XPATH_BODY
        self.column_clean =  fn_clean if (fn_clean is not None) else self._do_nothing
        self.row_transform = fn_transform if (fn_transform is not None) else self._do_nothing

    def _do_nothing(self, x):
        return(x)

    def get_doc(self, url=None, infile=None):
        infile = infile if (infile is not None) else self.infile

        if (self.reload) or (not os.path.exists(infile)):
            url = url if (url is not None) else self.url
            web_util.save_html(url, infile)

        self.doc = web_util.get_from_file(infile)

        return(self.doc)

    def get_header(self, xheader=None):
        xheader = xheader if (xheader is not None) else self.xpath_header
        if (self.doc is None): self.get_doc()

        ehead = self.doc.xpath(xheader)  # pass header by '//*[@id="example"]/thead/tr/th/text()

        #work pass header '//*[@id="example"]/thead/tr/th' if special tag in header
        #f_parse = lambda x: web_util.get_text(x)
        #ehead = list(map(f_parse, self.doc.xpath(xheader)))  # //*[@id="example"]/tbody/tr[1] --

        self.header = ehead
        return (self.header)

    def get_body(self, xbody=None):
        xbody = xbody if (xbody is not None) else self.xpath_body
        if (self.header is None): self.get_header()

        fn_clean = lambda x: self.column_clean(web_util.get_text(x))
        #fn_transform = lambda x: self._row_transform(x)
        #if self.doc is None: _

        elist = self.doc.xpath(xbody)  # //*[@id="example"]/tbody/tr[1]/td[2]  --
        table = []  # loop to get each rows

        if self.row_transform is None:
          table = [map(fn_clean, el.xpath('td')) for el in elist]  # loop to get each rows
        else:
            for el in elist:
                r= list(map(fn_clean, el.xpath('td')))
                r = self.row_transform(r)
                table.append(r)

        table = etl.headers.pushheader(table, self.header)
        self.rows = etl.sort(table, 0)
        #etl.tocsv(self.rows, self.outfile, encoding='utf8')
        return (self.rows)

    def get_table(self):
        #self.get_doc()
        #self.get_header()
        return self.get_body()

    def save(self):
        etl.tocsv(self.rows, self.outfile, encoding='utf8')

    def run(self):
        self.get_table()
        self.save()
        #logging.debug('\n{}'.format(self.rows))

def test_rate_105():
    url = 'http://stock.wespai.com/rate{}'.format(105)
    outfile = PATH + 'rate_{}.csv'.format(105)
    xheader = '//*[@id="example"]/thead/tr/th/text()'  # for 'http://stock.wespai.com/rate{}'
    xbody = '//*[@id="example"]/tbody/tr'  # for  //*[@id="example"]/tbody/tr[1]  //*[@id="example"]/tbody

    sc = webTableCrawler(url=url, xheader=xheader, xbody=xbody, outfile=outfile)
    sc.run()
    print(sc.rows)

def test_tse():
    date_str, outdate = '20160701', '105/07/01'
    url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php?download=&qdate={}&selectType=ALL".format(outdate)
    outfile = PATH + ('{}-t.csv').format(date_str)
    xheader = '//*[@id="main-content"]/table[2]/thead/tr[2]/td/text()'  #'//*[@id="main-content"]/table[2]/thead/tr[2]'
    xbody = '//table[2]/tbody/tr'  #loop for td to get the table content

    sc = webTableCrawler(url=url, xheader=xheader, xbody=xbody, outfile=outfile)
    #print (sc.get_doc())
    print (sc.get_header())
    print (sc.get_table())

def main():
    test_rate_105()
    #test_tse()

if __name__ == '__main__':
    #logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)
    main()
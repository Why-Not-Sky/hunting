# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------
* use get_text() or parse_text() to extract the text of td
       <td><a href="http://tw.stock.yahoo.com/d/s/dividend_0050.html" target="_blank">台灣50</a></td>
       <td><a href="" title="0050-歷年扣抵率" rel="rate" class="chart">0%</a></td>
       <td><a href="" title="0050-歷年股利" class="rate">0.85</a></td>
       <td>07/28</td>
       <td> </td>


---------------------------------------------------------------------------------------------------------------------------------------'''
import codecs
import lxml
import requests
import re
from os import path, mkdir
from lxml import html
import lxml.html.clean as clean
import chardet
import petl

def save_html(url, fname, payload=None):
    r = requests.get(url) if (payload is None) else requests.post(url, data=payload)
    prefix = path.dirname(fname)  # path.abspath(fname))
    if (prefix != '') and (not path.isdir(prefix)): mkdir(prefix)

    dic = chardet.detect(r.content[:1024])  #performance issue
    fcode = dic['encoding']
    # 2016/08/24: http://sh3ll.me/2014/06/18/python-requests-encoding/
    r.encoding = fcode
    #r.encoding = r.apparent_encoding   #apparent_encoding get poor performance

    with open(fname, "wb") as code:
        code.write(r.content)
        code.close()

    return (r.encoding)


def get_from_file(html_file):
    return get_etree(html_file)


def get_etree(html_file):
    #[2016/08/24: add clean_html]
    return clean.clean_html(html.fromstring(get_data(html_file)))


def get_header(html_file, xheader=''):
    el = get_from_file(html_file)
    return (el.xpath(xheader))


def get_data(html_file, encode='utf-8'):
    # infile = open(html_file, 'r')  # 'r')  # otc's object type is str
    # data = infile.read()   # unicode error

    # http://stackoverflow.com/questions/436220/python-is-there-a-way-to-determine-the-encoding-of-text-file
    # http://stackoverflow.com/questions/12468179/unicodedecodeerror-utf8-codec-cant-decode-byte-0x9c
    with codecs.open(html_file, "r", encoding=encode, errors='ignore') as fdata:  # rb
        # with codecs.open(html_file, "rb",  errors='ignore') as fdata:
        data = fdata.read()

    return data


def get_from_url(url, payload=None):
    r = requests.get(url) if (payload is None) else requests.post(url, data=payload)
    dic = chardet.detect(r.content[:10])  # performance issue
    fcode = dic['encoding']
    r.encoding = fcode #r.apparent_encoding

    # f = urllib.request.urlopen(url)
    # data = f.read()
    return (r.text)

def get_etree_from_url(url, payload=None):
    tree = html.fromstring(get_from_url(url, payload=payload))
    return tree


def get_text(ele, tail=False):  # htmlElement
    """
    :param ele: htmlElement
    :return: the text but not include tail
    """
    s = ele.text if ele.text is not None else ""
    # for e in ele[1:]: #.iter()[1:]:
    for index, e in enumerate(ele.iter()):
        if index >= 1: s += get_text(e)

    if (tail == True): s += ele.tail if ele.tail is not None else ""
    s = re.sub("\t", "", s.strip("\r\n").strip())
    return (s)


# special function to get <a> element text
def parse_text(td):  # td element
    '''
       <td><a href="http://tw.stock.yahoo.com/d/s/dividend_0050.html" target="_blank">台灣50</a></td>
       <td><a href="" title="0050-歷年扣抵率" rel="rate" class="chart">0%</a></td>
       <td><a href="" title="0050-歷年股利" class="rate">0.85</a></td>
       <td>07/28</td>
       <td> </td>
    '''
    e = td.xpath('a')
    if len(e) < 1:
        e = td.xpath('text()')
        if len(e) < 1:
            r = ''
        else:
            r = e[0]
    else:  # <td><a href="" title="0050-歷年股利" class="rate">0.85</a></td>
        r = e[0].xpath('text()')[0]  # [0]

    # r = e[0].text col = re.sub(",", "", content.strip())
    return (re.sub("\t", "", r.strip()))


def get_all_texts(el, class_name):
    return [e.text_content() for e in el.find_class(class_name)]

def retrieve_html_table(url=None, payload=None, xtable=None, header=None):
    r = requests.get(url) if (payload is None) else requests.post(url, data=payload)

    #print (r.encoding)
    #r.encoding = 'utf-8'
    fcode = chardet.detect(r.content[:1024])['encoding']  # performance issue
    r.encoding = r.apparent_encoding

    #tree = clean.clean_html(html.fromstring(r.text))
    tree = html.fromstring(r.text)

    etable = tree.xpath(xtable)
    rows = []
    for tb in etable:
        row = list(map(lambda x: get_text(x), tb.xpath('td')))
        rows.append(row)

    if (header is not None):
        rows = petl.headers.pushheader(rows, header)

    return(rows)

'''
__EVENTTARGET:LinkButton1
__EVENTARGUMENT:
__VIEWSTATE:/wEPDwULLTE5OTMyNjc5OTdkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQhidG5RdWVyeQUFb2NoYjEFBW9jaGIyBQVvY2hiMwUFb2NoYjS9Q3FCbhaOJOP/yma5goUcYrqchw==
__VIEWSTATEGENERATOR:42C20E80
hiddenServerEvent:tab4
txtStock:輸入台股代號/名稱
ddl2:20160902
ochb1:on
ochb1StateCont:2
ddl1:0.001
ochb2StateCont:1
ochb3StateCont:1
ochb4StateCont:1
#
'''
def test_crawl_stockHoldingStructure():
    trade_date = '20160826'
    payload = {
        '__EVENTTARGET': 'LinkButton1',
        '__EVENTARGUMENT': None,
        '__VIEWSTATE': '/wEPDwULLTE5OTMyNjc5OTdkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQhidG5RdWVyeQUFb2NoYjEFBW9jaGIyBQVvY2hiMwUFb2NoYjS9Q3FCbhaOJOP/yma5goUcYrqchw==',
        '__VIEWSTATEGENERATOR': '42C20E80',
        'hiddenServerEvent': 'tab4',
        'txtStock': '輸入台股代號/名稱',
        'ddl2': trade_date,
        # 'ochb1': 'on',          #沒選
        'ochb1StateCont': 1,
        'ddl1': 0.001,
        'ochb2StateCont': 1,
        #'ochb3': 'on',
        'ochb3StateCont': 1,
        #'ochb4': 'on',
        'ochb4StateCont': 1
    }

    url = 'http://norway.twsthr.info/StockHoldersTopWeek.aspx?Show=4'
    xtable = '//*[@id="adv_details"]/tbody/tr'
    rows = retrieve_html_table(url=url, payload=payload, xtable=xtable)
    print ('number of rows:{}'.format(len(rows)))
    rows=petl.look(rows)
    print(rows)

def test_crawl_tse_market_quotes():
    trade_month = '201608'
    year, month = trade_month[:4], trade_month[4:]
    payload = {
        'download': None,
        'query_year': year,
        'query_month': month
    }

    url = 'http://www.twse.com.tw/ch/trading/exchange/FMTQIK/FMTQIK.php'
    xtable = '//*[@id="main-content"]/table/tbody/tr'
    rows = retrieve_html_table(url=url, payload=payload, xtable=xtable)
    print ('number of rows:{}'.format(len(rows)))
    rows=petl.look(rows)
    print(rows)

def test_retrieve_html_table():
    trade_date = '105/08/23'
    payload = {
        'download': None,
        'qdate': trade_date,
        'select2': 'ALLBUT0999',
        'sorting': 'by_issue'
    }

    url = 'http://www.twse.com.tw/ch/trading/fund/T86/T86.php'
    xtable = '//*[@id="tbl-sortable"]/tbody/tr'
    rows = retrieve_html_table(url=url, payload=payload, xtable=xtable)
    print ('number of rows:{}'.format(len(rows)), rows)

    #not worked by request, some inform not passed
    url_get = url + '?' + 'download=&qdate={}&select2=ALLBUT0999&sorting=by_issue'.format(trade_date)
    #print(retrieve_html_table(url=url_get, xtable=xtable))

    url_otc = 'http://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_print.php?l=zh-tw&se=EW&t=D&d={}&s=0,asc,0'.format(trade_date)
    xbody = '//tbody/tr' # '/html/body/table/tbody/tr'
    rows = retrieve_html_table(url=url_otc, xtable=xbody)
    print ('number of rows:{}'.format(len(rows)), rows)

def get_report_date():
    html_str = '<option value="20160826">20160826</option><option value="20160819">20160819</option><option value="20160812">20160812</option><option value="20160805">20160805</option><option value="20160729">20160729</option><option value="20160722">20160722</option><option value="20160715">20160715</option><option value="20160707">20160707</option><option value="20160701">20160701</option><option value="20160624">20160624</option><option value="20160617">20160617</option><option value="20160608">20160608</option><option value="20160604">20160604</option><option value="20160527">20160527</option><option value="20160520">20160520</option><option value="20160513">20160513</option><option value="20160506">20160506</option><option value="20160429">20160429</option><option value="20160422">20160422</option><option value="20160415">20160415</option><option value="20160408">20160408</option><option value="20160401">20160401</option><option value="20160325">20160325</option><option value="20160318">20160318</option><option value="20160311">20160311</option><option value="20160304">20160304</option><option value="20160226">20160226</option><option value="20160219">20160219</option><option value="20160205">20160205</option><option value="20160130">20160130</option><option value="20160122">20160122</option><option value="20160115">20160115</option><option value="20160108">20160108</option><option value="20151231">20151231</option><option value="20151225">20151225</option><option value="20151218">20151218</option><option value="20151211">20151211</option><option value="20151204">20151204</option><option value="20151127">20151127</option><option value="20151120">20151120</option><option value="20151113">20151113</option><option value="20151106">20151106</option><option value="20151030">20151030</option><option value="20151023">20151023</option><option value="20151016">20151016</option><option value="20151008">20151008</option><option value="20151002">20151002</option><option value="20150925">20150925</option><option value="20150918">20150918</option><option value="20150911">20150911</option><option value="20150904">20150904</option><option value="20150828">20150828</option><option value="20150821">20150821</option><option value="20150814">20150814</option><option value="20150807">20150807</option><option value="20150731">20150731</option><option value="20150724">20150724</option><option value="20150717">20150717</option><option value="20150709">20150709</option><option value="20150703">20150703</option><option value="20150626">20150626</option><option value="20150618">20150618</option><option value="20150612">20150612</option><option value="20150605">20150605</option><option value="20150529">20150529</option><option value="20150522">20150522</option><option value="20150515">20150515</option><option value="20150508">20150508</option><option value="20150430">20150430</option>'
    tree = html.fromstring(html_str)
    print (tree.xpath('//option/text()'))

def main():
    test_crawl_tse_market_quotes()
    return
    get_report_date()
    test_crawl_stockHoldingStructure()
    test_retrieve_html_table()
    #test_post_data()
    #test_get_header()
    # test_save_html()


if __name__ == '__main__':
    main()

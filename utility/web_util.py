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


def save_html(url, fname, payload=None):
    r = requests.get(url) if (payload is None) else requests.post(url, data=payload)
    prefix = path.dirname(fname)  # path.abspath(fname))
    if (prefix != '') and (not path.isdir(prefix)): mkdir(prefix)

    #dic = chardet.detect(r.content[:10])
    #fcode = dic['encoding']
    # 2016/08/24: http://sh3ll.me/2014/06/18/python-requests-encoding/
    #r.encoding = 'utf8'
    r.encoding = r.apparent_encoding

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


def get_from_url(url):
    # f = urllib.request.urlopen(url)
    # data = f.read()
    response = requests.get(url)
    data = response.text
    tree = html.fromstring(data)
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

def retrieve_html_table(url=None, payload=None, xtable=None):
    r = requests.get(url) if (payload is None) else requests.post(url, data=payload)

    print (r.encoding)
    #r.encoding = 'utf-8'
    r.encoding = r.apparent_encoding

    tree = clean.clean_html(html.fromstring(r.text))

    etable = tree.xpath(xtable)
    rows = []
    for tb in etable:
        row = list(map(lambda x: get_text(x), tb.xpath('td')))
        rows.append(row)

    return(rows)


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


def main():
    test_retrieve_html_table()
    pass
    #test_post_data()
    #test_get_header()
    # test_save_html()


if __name__ == '__main__':
    main()

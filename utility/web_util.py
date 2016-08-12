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
import codecs
import lxml
import requests
import re
from os import path, mkdir
from lxml import html
import chardet

def save_html(url, fname):
    r = requests.get(url)
    prefix = path.dirname(fname) #path.abspath(fname))
    if (prefix != '') and (not path.isdir(prefix)): mkdir(prefix)

    dic = chardet.detect(r.content)
    fcode = dic['encoding']
    #fcode = 'utf-8'

    with open(fname, "wb") as code:
        code.write(r.content)
        #code.write(r.text.encode(fcode))
        code.close()

    return (fcode)

def get_from_file(html_file):
    return get_etree(html_file)

def get_etree(html_file):
    # html = etree.parse(html_file)
    # tree = html.document.fromstring(html)
    return html.fromstring(get_data(html_file))

def get_data(html_file, encode='utf-8'):
    #infile = open(html_file, 'r')  # 'r')  # otc's object type is str
    #data = infile.read()   # unicode error

    # http://stackoverflow.com/questions/436220/python-is-there-a-way-to-determine-the-encoding-of-text-file

    #http: // stackoverflow.com / questions / 12468179 / unicodedecodeerror - utf8 - codec - cant - decode - byte - 0x9c
    with codecs.open(html_file, "r", encoding=encode, errors='ignore') as fdata:  # rb
    #with codecs.open(html_file, "rb",  errors='ignore') as fdata:
        data = fdata.read()

    return data

def get_from_url(url):
    #f = urllib.request.urlopen(url)
    #data = f.read()
    response = requests.get(url)
    data = response.text
    tree = html.fromstring(data)
    return tree

def get_text(ele, tail=False):  #htmlElement
    """
    :param ele: htmlElement
    :return: the text but not include tail
    """
    s = ele.text if ele.text is not None else ""
    #for e in ele[1:]: #.iter()[1:]:
    for index, e in enumerate(ele.iter()):
        if index >=1: s +=  get_text(e)

    if (tail==True) : s += ele.tail if ele.tail is not None else ""
    s = re.sub("\t", "", s.strip("\r\n").strip())
    return(s)

# special function to get <a> element text
def parse_text(td):  #td element
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
        if len(e) < 1: r = ''
        else: r = e[0]
    else: # <td><a href="" title="0050-歷年股利" class="rate">0.85</a></td>
        r = e[0].xpath('text()')[0] #[0]

    # r = e[0].text col = re.sub(",", "", content.strip())
    return (re.sub("\t", "", r.strip()))

def get_all_texts(el, class_name):
    return [e.text_content() for e in el.find_class(class_name)]

def test_save_html():
    url = 'http://goodinfo.tw/stockinfo/StockList.asp?SHEET={}&MARKET_CAT={}&INDUSTRY_CAT={}&RPT_TIME={}&RANK={}'
    # &STEP=DATA&STOCK_CODE=
    url = url.format('營收狀況', '熱門排行', '營收年增率', '201607', '9999')
    save_html(url, 'revenue-get.html')

def test_post_data(month=201607):
    payload = {
        'SHEET': '營收狀況',
        'SHEET2': '',
        'MARKET_CAT': '熱門排行',
        'INDUSTRY_CAT': '營收年增率',
        'STOCK_CODE': '',
        'RPT_TIME': month,
        'STEP': 'DATA',
        'RANK': 99999
    }
    url = 'http://goodinfo.tw/stockinfo/StockList.asp'
    fname = 'revenue-{}.html'.format(month)

    page = requests.post(url, data=payload)
    with open(fname, "wb") as code:
        code.write(page.content)
        code.close()

def main():
    test_post_data()
    #test_save_html()

if __name__ == '__main__':
    main()
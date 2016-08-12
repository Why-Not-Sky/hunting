# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------



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
# http://stackoverflow.com/questions/436220/python-is-there-a-way-to-determine-the-encoding-of-text-file
#import libmagic as magic
import codecs
import chardet
from lxml import html, etree
from utility import web_util
import requests
import re
import petl as etl

def test_from_url():
    url = 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html'.format(105, 7)
    r = requests.get(url)

    el = html.fromstring(r.content)

    xheader = '/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr/th' #//*[@id="txtStockListData"]/div/table/tbody'
    xbody = '/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr/td/text()' #//*[@id="example"]/tbody/tr'
    thead = el.xpath('//table[2]//th[@class="tt"]')
    tbody = el.xpath('//tr[@align="right"]/td/text()')

    print (thead)
    print (tbody)
    #ehead = el.xpath(xheader)
    #ebody = el.xpath(xbody)

def to_number(x=''):
    col = x.encode('latin1', 'ignore').decode('big5')
    col = re.sub(",", "", col.strip())
    #col = ''.join(list(filter(lambda x: x in string.printable, col)))
    return col

def test_from_file():
    html_file = './201607.html'
    with codecs.open(html_file, "rb", errors='ignore') as fdata:
        data = fdata.read()

    #data = data.decode('big5').encode('big5')
    el = html.fromstring(data)

    #'/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody'
    ttable = el.xpath('/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr[2]')
    #'/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody'
    thead = el.xpath('//tr[2]/th[@class="tt"]/text()[1]')[:10]  #position() <= 1 //tr[2]/th[@class="tt"][1] [position() >= 1 and not(position() > 3)]
    tbody = el.xpath('//tr[@align="right"]')  #td/text()

    header = [x.encode('latin1', 'ignore').decode('big5') for x in thead]
    print (header)

    body = [el.xpath('td/text()')[:10] for el in tbody]
    table = etl.pushheader(body, header)
    table = etl.convertall(table, to_number)

    print (table)

    return

    for i in thead[:10]:
        #tt = i.text.encode('latin1', 'ignore').decode('big5')
        #fcode = chardet.detect(i)   unicode(utf8string, "utf-8")
        tt = i.encode('latin1', 'ignore').decode('big5') #.text.encode('latin1', 'ignore').decode('big5') #encode(fcode).decode('utf-8')
        print(tt) #.text.encode('latin1', 'ignore').decode('big5'))

    print(thead)
    #print(tbody)

def test_encode():
    html_file = './201607.html'
    url = 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html'.format(105, 7)
    fcode = web_util.save_html(url, html_file)
    print(fcode)

    with codecs.open(html_file, "r", encoding=fcode, errors='ignore') as fdata:  #,  encoding=fcode
        data = fdata.read()
        fdata.close()

    #fcode = chardet.detect(data)

    #tree = etree.parse(html_file)#, encoding='Big5')

    el = html.fromstring(data.decode(fcode))
    xheader = '/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr//text()' #//*[@id="txtStockListData"]/div/table/tbody'
    xbody = '/html/body/center/center/table[2]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr//text()' #//*[@id="example"]/tbody/tr'

    ehead = el.xpath(xheader)
    ebody = el.xpath(xbody)
    print (ehead)
    print (ebody)

def main():
    test_from_file()
    #test_from_url()
    #test_encode()

if __name__ == '__main__':
    main()
# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------------------------------------------------'''
import time
from datetime import date, timedelta, datetime
from dateutil.rrule import rrule, MONTHLY

def date_to_int(date_str='20160712', esc_char='/'):
    date_str = date_str.replace(esc_char, '')
    return int(date_str[:4]), int(date_str[4:6]), int(date_str[6:])

def to_taiwan_date(date_str='20160712', esc_char='/'):
    year, month, day = date_to_int(date_str, esc_char)
    taiwan_date = '{0}{esc_ch}{1:02d}{esc_ch}{2:02d}'.format(year - 1911, month, day, esc_ch=esc_char)
    return taiwan_date

def to_century_date(taiwan_date='105/07/12', esc_char='/'):
    '''in:105/07/12, /  --> 2106/07/12
       in:1050712  --> 20160712
    '''
    taiwan_date = taiwan_date.replace(esc_char, '')
    year = int(taiwan_date[:3]) + 1911
    month = int(taiwan_date[3:5])
    day = int(taiwan_date[5:])
    century_date = '{0}{esc_ch}{1:02d}{esc_ch}{2:02d}'.format(year, month, day, esc_ch=esc_char)
    return century_date

def date_range(start_date, end_date):
    """ date_range(20160701, 20160712) """
    # 若是字串則自動轉換為日期
    start_date = str_to_date(start_date) if isinstance(start_date, str) else start_date
    end_date = str_to_date(end_date)  if isinstance(end_date, str) else end_date
    nday = 1 + (end_date - start_date).days

    dlist = list(start_date + timedelta(n) for n in range(nday))
    return dlist

def month_range(start_month, end_month, type='s'):
    """ date_range(201601, 201607) """
    # 若是字串則自動轉換為日期
    start_month = str_to_date(start_month+'01')
    end_month = str_to_date(end_month+'01')

    dlist = [dt for dt in rrule(MONTHLY, dtstart=start_month, until=end_month)]

    if (type=='s'): dlist = [d.strftime('%Y%m') for d in dlist]
    #dlist = list((start_month + timedelta(n)).strftime('%Y%m') for n in range(nm))

    return dlist

def test_month_range():
    start_month, end_month = '201508', '201607'
    print (month_range(start_month, end_month))
    print(month_range(start_month, end_month, 'm'))

def date_str_add(date_str, delta=1):
    d = str_to_date(date_str)
    nd = d + timedelta(delta)
    return nd.strftime('%Y%m%d')
    pass

def str_date_to_int(date_str='20160712', esc_char='/'):
    date_str = date_str.replace(esc_char, '')
    year = int(date_str[:4])
    month = int(date_str[4:6])
    day = int(date_str[6:])
    return year, month, day

def str_to_date(date_str='20160712', esc_char=''):
    year, month, day = str_date_to_int(date_str, esc_char)
    return date(year, month, day)

def to_taiwan_date_str(date_str='20160712', esc_char='/'):
    year, month, day = str_date_to_int(date_str, esc_char)
    taiwan_date = '{0}{esc_ch}{1:02d}{esc_ch}{2:02d}'.format(year - 1911, month, day, esc_ch=esc_char)
    return taiwan_date

def to_century_date_str(self, taiwan_date='105/07/12', esc_char='/'):
    '''in:105/07/12, /  --> 2106/07/12
       in:1050712  --> 20160712
    '''
    taiwan_date = taiwan_date.replace(esc_char, '')
    year = int(taiwan_date[:3]) + 1911
    month = int(taiwan_date[3:5])
    day = int(taiwan_date[5:])
    century_date = '{0}{esc_ch}{1:02d}{esc_ch}{2:02d}'.format(year, month, day, esc_ch=esc_char)
    return century_date

def test_date_rang():
    dlist = date_range('20160725', '20160727')

    for d in dlist:
        date_str = d.strftime('%Y%m%d')
        print('Crawling {} '.format(date_str))

def main():
    test_month_range()
    #test_date_rang()

if __name__ == '__main__':
    main()
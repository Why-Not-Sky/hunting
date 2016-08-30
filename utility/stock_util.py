# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------------------------------------------------'''
import re
import string

from utility import math_util

def to_number(x='', default_vaule='0'):
    _CONVERT_ZERO = ['', '--', '---', '---', 'x', 'X', 'null', 'NULL']  # convert illegal value into 0

    #return(x)
    if not (type(x) is str): return(x)

    col = re.sub(",", "", x.strip())
    col = ''.join(list(filter(lambda x: x in string.printable, col)))
    return default_vaule if (col in _CONVERT_ZERO) or (not math_util.is_number(col)) else col.strip()

def test_to_number():
    rlist = ['3', '2.3', '-1.2', '30%', '不適合', 'A', '']
    flist = [0, 1, 2, 4, 6]
    fn_clean = lambda x: to_number(x, None)
    l=[]
    for idx, r in enumerate(rlist):
        print (idx, r)
        l.append(to_number(r) if idx in flist else r)

    mlist = [to_number(r) if (idx in flist) else r for idx, r in enumerate(rlist)]

    print (l)

    #mlist = list(map(lambda i, x: to_number(x, None) if i in flist else x, enumerate(rlist)))
    print (mlist)

def main():
    pass

if __name__ == '__main__':
    main()
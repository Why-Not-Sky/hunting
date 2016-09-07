# -*- coding: utf-8 -*-
'''---------------------------------------------------------------------------------------------------------------------------------------
version  date    author     memo
------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------------------------------------------------------------------------
non-function requirement: 
    * 
    * 
    *
---------------------------------------------------------------------------------------------------------------------------------------'''
from bs4 import BeautifulSoup
import requests
import lxml.html
import mechanicalsoup
import lxml.html.clean as clean
from lxml import html
try:
    from http.cookiejar import CookieJar
except ImportError:
    from cookielib import CookieJar

from utility import web_util

def cas_login(service, username, password):
    # GET parameters - URL we'd like to log into.
    params = {'service': service}
    LOGIN_URL = 'https://login.case.edu/cas/login'

    # Start session and get login form.
    session = requests.session()
    login = session.get(LOGIN_URL, params=params)

    # Get the hidden elements and put them in our form.
    login_html = lxml.html.fromstring(login.text)
    hidden_elements = login_html.xpath('//form//input[@type="hidden"]')
    form = {x.attrib['name']: x.attrib['value'] for x in hidden_elements}

    # "Fill out" the form.
    form['username'] = username
    form['password'] = password

    # Finally, login and return the session.
    session.post(LOGIN_URL, data=form, params=params)
    return session

# http://brennan.io/2016/03/02/logging-in-with-requests/
def login(url='https://w.sk88.com.tw/Cross/Pc/Login.aspx', uid='F120682415', pwd='mic7693'):
    s = requests.session()

    ### Here, we're getting the login page and then grabbing hidden form
    ### fields.  We're probably also getting several session cookies too.
    login = s.get(url)
    login_html = lxml.html.fromstring(login.text)
    # //*[@id="TxtIDNo"]
    # <input name="HiddenIDNo" type="hidden" id="HiddenIDNo" value="F120682415">
    hidden_inputs = login_html.xpath('//form//input[@type="hidden"]') #.xpath(r'//form//input[@type="hidden"]')
    form = {x.attrib["name"]: x.attrib["value"] if "value" in x.attrib else "" for x in hidden_inputs}
    print(form)

    ### Now that we have the hidden form fields, let's add in our 
    ### username and password.
    form['HiddenIDNo'] = uid # Enter an email here.  Not mine.
    #//*[@id="TxtPass"] <input name="TxtPass" type="password" id="TxtPass" class="text_Login" border="1" />
    form['TxtPass'] =  pwd # I'm definitely not telling you my password.
    response = s.post(url, data=form)

    ### How can we tell that we logged in?  Well, these worked for me:
    print (response.url)
    print (response.text)

def login_gitHub():
    # Browser
    br = mechanize.Browser()

    # Cookie Jar
    cj = CookieJar.LWPCookieJar()
    br.set_cookiejar(cj)

    # Browser options
    br.set_handle_equiv(True)
    br.set_handle_gzip(True)
    br.set_handle_redirect(True)
    br.set_handle_referer(True)
    br.set_handle_robots(False)
    br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time=1)

    br.addheaders = [('User-agent', 'Chrome')]

    # The site we will navigate into, handling it's session
    br.open('https://github.com/login')

    # View available forms
    for f in br.forms():
        print (f)

    # Select the second (index one) form (the first form is a search query box)
    br.select_form(nr=1)

    # User credentials
    br.form['login'] = 'Why-Not-Sky'
    br.form['password'] = 'mic0918'

    # Login
    br.submit()

    print(br.open('https://github.com/settings/emails').read())

def login_sk88(browser):
    URL = "https://w.sk88.com.tw/Cross/Pc/Login.aspx"
    LOGIN = "F120682415"
    PASSWORD = "mic7693"
    TWITTER_NAME = "why_not_sky"  # without @

    # Create a browser object
    #browser = mechanicalsoup.Browser()

    # request login page
    login_page = browser.get(URL)

    # we grab the login form
    login_form = login_page.soup.find("form", {"id":"Form2"})

    # find login and password inputs
    login_form.find("input", {"name": "TxtIDNo"})["value"] = LOGIN
    login_form.find("input", {"name": "TxtPass"})["value"] = PASSWORD

    # submit form
    response = browser.submit(login_form, login_page.url)
    main_url = 'https://w.sk88.com.tw/Cross/Pc/SMP_Main.aspx'
    cert_url = 'https://w.sk88.com.tw/Cross/Pc/CertCheckExist.aspx?Key=SKIS_0_0_228079_3&Stts=安裝憑證(40)&CertStartDate=105/05/22&CertEndDate=107/05/23&Seno=3&Seri=4615e16755fa7032923c6c2c9d58251d&'

    if (response.url != main_url):
        main_page = browser.get(cert_url)
        print (main_page.text)

    print (response.url)
    return (response.url == main_url)

def crawl_invesement_performance():
    # Create a browser object
    browser = mechanicalsoup.Browser()
    # Cookie Jar
    cj = CookieJar()
    browser.set_cookiejar(cj)

    if login_sk88(browser) is False: return

    url = 'https://w.sk88.com.tw/Cross/Pc/QueryFinalizingAmount.aspx'
    #query_string = 'TxtDate=105/08/23&TxtDate1=105/8/30&DDLSett=1013761&DDLPage=300'
    #url += '?' + query_string
    payload = {
        'TxtDateStat': 'TxtDateStat',
        'TxtDate': '105/08/23',
        'TxtDate1': '105/08/30',
        'DDLSett': '1013761',
        'TxtSymb': None,
        'DDLPage': 300,
        'BtnQuery': '查詢'
    }

    result_page = browser.get(url)

    # <form name="form1" method="post" action="./QueryFinalizingAmount.aspx?TxtDate=105%2f08%2f23&amp;TxtDate1=105%2f8%2f30&amp;DDLSett=1013761&amp;DDLPage=300" id="form1">
    query_form = result_page.soup.find("form", {"name": "form1"})

    # find login and password inputs
    query_form.find("input", {"id": "TxtDate"})["value"] = '105/08/23'
    query_form.find("input", {"id": "TxtDate1"})["value"] = '105/08/30'
    query_form.find("input", {"id": "DDLSett"})["value"] = '1013761'
    query_form.find("input", {"id": "DDLPage"})["value"] = '300'

    # submit form
    r = browser.submit(query_form, url)

    tree = clean.clean_html(html.fromstring(r.text))
    xtable = '//*[@id="GVSymbPosition"]/tbody/tr'
    etable = tree.xpath(xtable)
    rows = []
    for tb in etable:
        row = list(map(lambda x: web_util.get_text(x), tb.xpath('td')))
        rows.append(row)

    return(rows)


def login_twitter():
    URL = "https://twitter.com/login"
    LOGIN = "why_not_sky"
    PASSWORD = "mic0918"
    TWITTER_NAME = "why_not_sky"  # without @

    # Create a browser object
    browser = mechanicalsoup.Browser()

    # request Twitter login page
    login_page = browser.get(URL)

    # we grab the login form
    login_form = login_page.soup.find("form", {"class":"LoginForm js-front-signin"})   #signin
    #login_form = login_page.soup.find("form")   #signin

    # find login and password inputs
    login_form.find("input", {"name": "session[username_or_email]"})["value"] = LOGIN
    login_form.find("input", {"name": "session[password]"})["value"] = PASSWORD

    # submit form
    response = browser.submit(login_form, login_page.url)

    # verify we are now logged in ( get username in webpage )
    user = response.soup.find("span", { "class":"u-linkComplex-target"}).string

    if TWITTER_NAME in user:
        print("You’reconnected as " + TWITTER_NAME)
    else:
        print("Notconnected")



def main():
    #login_gitHub()
    #login_sk88()
    crawl_invesement_performance()


if __name__ == '__main__':
    main()
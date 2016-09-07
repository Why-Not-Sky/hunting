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
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class CygwinFirefoxProfile(webdriver.FirefoxProfile):
    @property
    def path(self):
        path = self.profile_dir
        # Do stuff to the path as described in Jeff Hoye's answer
        return path

def init_driver():
    # replace with your firefox profile firefox_profile
    fp = webdriver.FirefoxProfile('/Users/sky_wu/workspace/fireFox/scraper')
    driver = webdriver.Firefox(fp)
    #driver = webdriver.Firefox(firefox_profile=CygwinFirefoxProfile())
    #driver = webdriver.Firefox()

    driver.wait = WebDriverWait(driver, 20)
    return driver


def lookup(driver, query):
    driver.get("http://www.google.com")
    try:
        box = driver.wait.until(EC.presence_of_element_located(
            (By.NAME, "q")))
        button = driver.wait.until(EC.element_to_be_clickable(
            (By.NAME, "btnK")))
        box.send_keys(query)
        button.click()
    except TimeoutException:
        print("Box or Button not found in google.com")


if __name__ == "__main__":
    driver = init_driver()
    lookup(driver, "Selenium")
    time.sleep(3)
    driver.quit()


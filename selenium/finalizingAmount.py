# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class Sk88(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://w.sk88.com.tw/Cross/Pc/Login.aspx"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_sk88(self):
        driver = self.driver
        driver.get(self.base_url + "/Cross/Pc/Login.aspx")
        driver.find_element_by_id("TxtIDNo").clear()
        driver.find_element_by_id("TxtIDNo").send_keys("F120682415")
        driver.find_element_by_id("TxtPass").clear()
        driver.find_element_by_id("TxtPass").send_keys("mic7693")
        driver.find_element_by_id("Button1").click()
        driver.get("https://w.sk88.com.tw/Cross/Pc/MenuTopList.aspx?MenuListid=2")
        driver.get("https://w.sk88.com.tw/Cross/Pc/QueryFinalizingAmount.aspx")
        driver.find_element_by_id("TxtDate").clear()
        driver.find_element_by_id("TxtDate").send_keys("2016/08/16")
        driver.find_element_by_id("BtnQuery").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()

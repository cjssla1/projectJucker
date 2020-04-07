from selenium import webdriver
from bs4 import BeautifulSoup
import sqlite3

def craw() :
    url = 'https://finance.naver.com/sise/sise_market_sum.nhn'
    driver = webdriver.Chrome('C:/Users/w9879/OneDrive/바탕 화면/4학년/캡스톤디자인/chromedriver/chromedriver.exe')
    driver.get(url)

    driver.find_element_by_css_selector('#option4').click()  # 시가총액(억)
    driver.find_element_by_css_selector('#option6').click()  # PER(배)
    driver.find_element_by_css_selector('#option7').click()  # 시가
    driver.find_element_by_css_selector('#option12').click() # ROE(%)
    driver.find_element_by_css_selector('#option13').click() # 고가
    driver.find_element_by_css_selector('#option15').click() # 외국인비율
    driver.find_element_by_css_selector('#option19').click() # 저가
    driver.find_element_by_css_selector('#option21').click() # 상장주식수(천주)
    driver.find_element_by_css_selector('#contentarea_left > div.box_type_m > form > div > div > div > a:nth-child(1) > img').click() # 적용하기

    t_data = []
    n_data = []

    for i in range(1, 2) :
        url = 'https://finance.naver.com/sise/sise_market_sum.nhn?&page=' + str(i)
        driver.get(url)

        html = driver.page_source
        bs = BeautifulSoup(html, 'html.parser')

        title = bs.select('a.tltle')
        number = bs.select('td.number')
        
        for t in title :
            t_data.append(t.text)
        for n in number :
            n_data.append(n.text)

    for i in range(0, len(n_data)) :
        n_data[i] = n_data[i].strip()

    print(n_data)

    con = sqlite3.connect('C:/Users/w9879/OneDrive/바탕 화면/4학년/캡스톤디자인/DB/stock.db')
    cur = con.cursor()

    print(len(t_data))
    print(len(n_data))
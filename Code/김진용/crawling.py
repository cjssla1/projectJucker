from selenium import webdriver
from bs4 import BeautifulSoup
from inputDB import *

def craw() :
    db = DBconn()
    
    url = 'https://finance.naver.com/sise/sise_market_sum.nhn'
    driver = webdriver.Chrome('/usr/bin/chromedriver')
    #driver = webdriver.Chrome('C:/Users/w9879/OneDrive/바탕 화면/4학년/캡스톤디자인/chromedriver/chromedriver')
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

    t_data = [] # title
    n_data = [] # number
    name = ''
    end = 0
    start = 0
    high = 0
    low = 0
    tran = 0

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
        n_data[i] = n_data[i].replace(",", "")

    
    for j in range(0, len(t_data)) :
        name = str(t_data[j])
        end = int(n_data[j*8])
        start = int(n_data[j*8+5])
        high = int(n_data[j*8+6])
        low = int(n_data[j*8+7])
        tran = int(n_data[j*8+4])
        db.insert(name, end, start, high, low, tran)

if __name__ == "__main__" :
    craw()
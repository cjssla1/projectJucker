from selenium import webdriver
from bs4 import BeautifulSoup as bs
import requests
from crawlingDB import *

#driver = webdriver.Chrome('C:/Users/khj40/Desktop/학교/4학년 1학기/캡스톤디자인/chromedriver')
driver = webdriver.Chrome('/usr/bin/chromedriver')
driver.get('https://finance.naver.com/sise/sise_market_sum.nhn?&page=1')

driver.find_element_by_css_selector('#option4').click() # 시가총액(억) 해제
driver.find_element_by_css_selector('#option6').click() # PER(배) 해제
driver.find_element_by_css_selector('#option7').click() # 시가 선택
driver.find_element_by_css_selector('#option12').click() # ROE(%) 해제
driver.find_element_by_css_selector('#option13').click() # 고가 선택
driver.find_element_by_css_selector('#option15').click() # 외국인비율 해제
driver.find_element_by_css_selector('#option19').click() # 저가 선택
driver.find_element_by_css_selector('#option21').click() # 상장주식수(천주) 해제
driver.find_element_by_css_selector('#contentarea_left > div.box_type_m > form > div > div > div > a:nth-child(1)').click() # 적용하기

save_name = []
save_index = []

db = DB()

for i in range (1, 33, 1) :
    url = driver.get('https://finance.naver.com/sise/sise_market_sum.nhn?&page=' + str(i))
    html = driver.page_source
    soup = bs(html, 'html.parser')

    name = soup.select('a.tltle') # 종목명
    index = soup.select('td.number') # 종목 지표 

    # 종목명 저장
    for key in name :
        save_name.append(key.text)
    
    # 현재가, 거래량, 시가, 고가, 저가 저장
    for x in range (len(index)) :
        if x % 8 >= 1 and x % 8 <= 3 : # 필요없는 지표 제거
            continue
        else :
            save_index.append(index[x].text.replace(",",""))

j = 0
for S_name in save_name :
    db.insert(S_name, save_index, j)
    j += 5

driver.quit()

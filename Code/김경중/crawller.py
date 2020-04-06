from selenium import webdriver
from selenium.webdriver.firefox.options import Options
import myDBlib
import datetime

options = webdriver.FirefoxOptions()
options.add_argument('--headless')
driver = webdriver.Firefox(firefox_options=options)
driver.get("https://finance.naver.com/sise/sise_market_sum.nhn")

#페이지가 동적이라 스위치 눌러줘야함, 필요한 부분 선택하고
#불 필요한데 기본 선택되어있는 스위치 해제
driver.find_element_by_css_selector('#option7').click()
driver.find_element_by_css_selector('#option13').click()
driver.find_element_by_css_selector('#option19').click()
driver.find_element_by_css_selector('#option15').click()
driver.find_element_by_css_selector('#option21').click()
driver.find_element_by_css_selector('#option4').click()
driver.find_element_by_css_selector('#option6').click()
driver.find_element_by_css_selector('#option12').click()
#적용하기 버튼
driver.find_element_by_css_selector('#contentarea_left > div.box_type_m > form > div > div > div > a:nth-child(1)').click()

#1페이지부터 32페이지까지 총 1562개 주식정보
for idx in range(1,2):
    url = 'https://finance.naver.com/sise/sise_market_sum.nhn?&page='+str(idx)
    driver.get(url)
    #주식 이름
    names = driver.find_elements_by_css_selector('a.tltle')
    #수치들 
    numbers = driver.find_elements_by_css_selector('td.number')

    #수치 줄로 엮기
    line = [numbers[0].text]
    #날짜 추가용
    today = datetime.datetime.today()
    td = today.strftime('%Y-%m-%d')
    x = 0 #이름 가져오기 위함

    for i in range(1,len(numbers)):
        #줄 바꿈
        if i % 8 == 0:
            #종목 이름,날짜 추가
            line.append(names[x].text)
            x+=1
            line.append(td)

            #숫자 형변환
            for j in range(0,5):
                line[j] = int(line[j].replace(',',''))
            
            #DB 삽입
            dbc = myDBlib.DBcon('localhost','admin','1234','stock')
            dbc.sendtoDB(
                line[5],line[0],line[2],line[3],line[4],line[1],line[6])
            #

            line = [numbers[i].text]
        elif i % 8 >= 1 and i % 8 <= 3:
            #불필요 제거
            continue
        else:
            line.append(numbers[i].text)


driver.quit()

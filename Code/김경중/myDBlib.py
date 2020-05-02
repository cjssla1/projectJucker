#!usr/bin/python3

import MySQLdb

class DBcon:
    ip = 'localhost'
    user = 'admin'
    pwd = '1234'
    dbname = 'stock'
    db = MySQLdb.connect(ip,user,pwd,dbname,charset='utf8')
    cursor = db.cursor()

    def __init__(self,_ip:str,_user:str,_pwd:str,_dbname:str):
        self.ip = _ip
        self.user = _user
        self.pwd = _pwd
        self.dbname = _dbname
        self.db = MySQLdb.connect(_ip,_user,_pwd,_dbname,charset='utf8')
        self.cursor = self.db.cursor()
    
    def __del__(self):
        self.db.close()

    def sendtoDB(self,sname,end,start,high,low,tran,day):
        sql = "INSERT INTO rawData VALUES(%s,%s,%s,%s,%s,%s,%s)"
        val = (sname,end,start,high,low,tran,day)
        self.cursor.execute(sql,val)
        self.db.commit()

    def getformDB(self):
        sql = "SELECT * FROM rawData"
        self.cursor.execute(sql)
        rows = self.cursor.fetchall()

         
    #날짜와 개수를 입력받아 해당 날짜와 이전의 개수만큼의 날짜의 데이터를 가져옴
    #get_learing_data('2020-04-20',3) => 04-17 ~ 04-19 의 데이터(5개씩)와 4-20의 데이터(1개) 가져옴
    def get_learing_data(self,date,count):
        
        #해당 날짜의 아이디 값 가져오기
        sql = "SELECT id FROM stockDay WHERE day = '{}'".format(date)
        self.cursor.execute(sql)
        id = self.cursor.fetchone()
        id = id[0] - count
        
        #가져온 id부터 앞의 count 개수 만큼의 날들 가져오기
        sql = "SELECT day FROM stockDay WHERE id >= {} ".format(id)
        self.cursor.execute(sql)
        temp = self.cursor.fetchmany(count)
        days = []
        for e in temp:
            days.append(e[0])

        # 종목명 가져오기
        sql = "SELECT name FROM rawData WHERE day = '{}'".format(date)
        self.cursor.execute(sql)
        temp = self.cursor.fetchall()
        names = []
        for e in temp:
            names.append(e[0])

        
        #종목명과 날짜 조건으로 가져오기
        result = []
        for i in range(len(names)):
            
            # count일 만큼의 정보들 가져옴
            sql = "SELECT end,start,high,low,tran FROM rawData WHERE "
            nsql = "name = '{}'".format(names[i])
            line = [names[i]]
            #앞 선 요일마다의 데이터 추가
            for j in days:
                dsql = "AND day = '{}'".format(j)
                self.cursor.execute(sql+nsql+dsql)
                temp = self.cursor.fetchone()
                if temp != None:
                    for k in temp:
                        line.append(k)

            #해당 날짜의 종가 값 추가
            sql = "SELECT end FROM rawData WHERE day = '{}' AND name = '{}'".format(date,names[i])
            self.cursor.execute(sql)
            dateend = self.cursor.fetchone()
            dateend = dateend[0]
            line.append(dateend)
            result.append(line)

        return result

#저장하고 가져오기 예제
'''
dbc = DBcon('localhost','admin','1234','stock')
dbc.sendtoDB('한글',1,2,3,4,5,'2020-04-06')
dbc.getformDB()
'''


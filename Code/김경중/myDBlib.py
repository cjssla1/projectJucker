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
        print(rows)

    #날짜와 개수를 입력받아 해당 날짜와 이전의 개수만큼의 날짜의 데이터를 가져옴
    #get_learing_data('2020-04-20',3) => 04-17 ~ 04-20 의 데이터 가져옴
    def get_learing_data(self,date,count):

        #해당 날짜의 아이디 값 가져오기
        sql = "SELECT id FROM stockDay WHERE day = '{}'".format(date)
        self.cursor.execute(sql)
        id = self.cursor.fetchone()
        id = id[0] - 1
        
        #가져온 id부터 앞의 count 개수 만큼의 날들
        sql = "SELECT day FROM stockDay WHERE id <= {} ORDER BY id DESC".format(id)
        self.cursor.execute(sql)
        temp = self.cursor.fetchmany(count)
        target = []
        for e in temp:
            target.append(e[0])
        
        #타겟에 있는 값들 가져오기
        ###################3# 이름, 날짜로 묶어서 가져오도록 수정 필요
        result = []
        for e in target:
            sql = "SELECT name,end,start,high,low, tran FROM rawData WHERE day ='{}'".format(e)
            self.cursor.execute(sql)
            temp = self.cursor.fetchall()
            for k in temp:
                result.append(k)
        return result

#저장하고 가져오기 예제
'''
dbc = DBcon('localhost','admin','1234','stock')
dbc.sendtoDB('한글',1,2,3,4,5,'2020-04-06')
dbc.getformDB()
'''


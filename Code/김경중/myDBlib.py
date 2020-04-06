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



#저장하고 가져오기 예제
'''
dbc = DBcon('localhost','admin','1234','stock')
dbc.sendtoDB('한글',1,2,3,4,5,'2020-04-06')
dbc.getformDB()
'''


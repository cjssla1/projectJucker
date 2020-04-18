import datetime
import pymysql

class DBconn :
    def __init__(self) :
        self.conn = pymysql.connect(
            user = 'root',
            passwd = 'w3084926',
            host = '127.0.0.1',
            db = 'stock',
            charset = 'utf8'
        )
        self.cursor = self.conn.cursor()
    
    def insert(self, name, end, start, high, low, tran) :
        day = str(datetime.datetime.now())
        day = day[0:19]
        sql = 'INSERT INTO rawData VALUES(\'%s\', %d, %d, %d, %d, %d, \'%s\');' %(name, end, start, high, low, tran, day)
        self.cursor.execute(sql)
        self.conn.commit()
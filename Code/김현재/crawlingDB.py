import pymysql

class DB :
    def __init__(self) :
        self.conn = pymysql.connect(
            user = 'admin',
            passwd = '3946',
            host = '127.0.0.1',
            db = 'mydb',
            charset = 'utf8'
        )
        self.cursor = self.conn.cursor()

    def insert(self, name, index, i, day) :
        sql = 'INSERT INTO stock(name, day, current, updown, tran, start, high, low, aggregate) VALUES (\'%s\', \'%s\', %s, %s, %s, %s, %s, %s, %s);' %(name, day, index[i], index[i+1], index[i+2], index[i+3], index[i+4], index[i+5], index[i+6])
        self.cursor.execute(sql)
        self.conn.commit()

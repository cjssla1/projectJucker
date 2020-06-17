import pymysql
import datetime

with open('C:/capston/Symbols.txt', 'r') as f:
    data = f.readline()
    Symbols = data.split(',')

conn = pymysql.connect(host='127.0.0.1', user='root', password='3946', db='mydb', charset='utf8')

curs = conn.cursor()

for sb in Symbols:
    #SHOW VARIABLES LIKE "secure_file_priv"
    sql = "select \'symbol\', \'date\', \'price\' union select symbol, day as date, end as price from stockdata where symbol = " + sb + " INTO OUTFILE \'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/"+ sb + ".csv\' FIELDS TERMINATED BY \',\' OPTIONALLY ENCLOSED BY \'\"\' LINES TERMINATED BY \'\\n\';"
    print(sb)
    curs.execute(sql)
conn.commit()

conn.close()

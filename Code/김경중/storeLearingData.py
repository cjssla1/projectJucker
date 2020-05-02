#!usr/bin/python3
import myDBlib

filename = 'data11.txt'
date = '2020-04-29'
n = 3

db = myDBlib.DBcon('localhost','admin','1234','stock')
r = db.get_learing_data(date, n)
alltexts = []
for e in r:
    line = ''
    for i in e:
        line += str(i)+','
    line = line[:-1]
    line += '\n'
    alltexts.append(line)

print('all texts ok')

with open(filename,'w') as f:
    for i in alltexts:
        f.write(i)

#!/usr/bin/python3
print("Content-Type: text/html")
print()
import cgi, os
 
files = os.listdir('../data')
listStr = ''
for item in files:
    listStr = listStr + '<li><a href="view.py?id={name}">{name}</a></li>'.format(name=item)
create_link = 'create.py'

print('''
<!doctype html>
<html>
<head>
    <title>board</title>
    <meta charset="utf-8">
</head>
<body>
    <ol>{listStr}</ol>
    <a href="{create_link}">create</a>
</body>
</html>
'''.format(listStr=listStr,create_link=create_link))
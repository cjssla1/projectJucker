#!/usr/bin/python3
print("Content-Type: text/html")
print()
import cgi, os
 
files = os.listdir('../data')
listStr = ''
for item in files:
    listStr = listStr + '<li><a href="view.py?id={name}">{name}</a></li>'.format(name=item)
     
form = cgi.FieldStorage()
if 'id' in form:
    pageId = form["id"].value
    description = open('../data/'+pageId, 'r').read()
    update_link = '<a href="update.py?id={}">update</a>'.format(pageId)
    delete_action = '''
        <form action="process_delete.py" method="post">
            <input type="hidden" name="pageId" value="{}">
            <input type="submit" value="delete">
        </form>'''.format(pageId)
else:
    pageId = 'no id'
    description = '404 not found, there is no page'
    update_link = ''
    delete_action=''

print('''<!doctype html>
<html>
<head>
  <title>view</title>
  <meta charset="utf-8">
</head>
<body>
  <h2>{title}</h2>
  <p>{desc}</p>
  {update_link}
  {delete_action}
  <a href="board.py">board</a>
  <ol>
    {listStr}
  </ol>
</body>
</html>
'''.format(title=pageId, desc=description, listStr=listStr,update_link=update_link,delete_action=delete_action))
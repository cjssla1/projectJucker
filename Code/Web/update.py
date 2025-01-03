#!/usr/bin/python3
print("Content-Type: text/html")
print()
import cgi, os
 
files = os.listdir('../data')
listStr = ''
for item in files:
    listStr = listStr + '<li><a href="board.py?id={name}">{name}</a></li>'.format(name=item)
 
form = cgi.FieldStorage()
if 'id' in form:
    pageId = form["id"].value
    description = open('../data/'+pageId, 'r').read()

print('''<!doctype html>
<html>
<head>
  <title>{title}</title>
  <meta charset="utf-8">
</head>
<body>
  <form action="process_update.py" method="post">
      <input type="hidden" name="pageId" value="{form_default_title}">
      <p><input type="text" name="title" placeholder="title" value="{form_default_title}"></p>
      <p><textarea rows="4" name="description" placeholder="description">{form_default_description}</textarea></p>
      <p><input type="submit"></p>
  </form>
  <ol>
    {listStr}
  </ol>
</body>
</html>
'''.format(title=pageId, desc=description, listStr=listStr, form_default_title=pageId, form_default_description=description))
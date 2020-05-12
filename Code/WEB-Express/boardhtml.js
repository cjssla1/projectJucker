
var getlisthtml = function(list)
{
    var res = '<ul>';
    for(var i=0; i<list.length;i++){
        res += `
        <li>
            <a href="/board/page/${list[i].id}">${list[i].title}</a>
            <a>${list[i].author}</a>
            <a>${list[i].time}</a>
        </li>`;
    }
    res += '</ul>';

    return res;
}

module.exports = {
    BoardHome:function(title,res,body){
        var listhtml = getlisthtml(res)

        return `
            <!doctype html>
            <html>
            <head>
                <title>${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1>${title}</h1>
                <p>${listhtml}</p>
                <p>${body}</p>
                <a href="/board/create">글쓰기</a>
            </body>
            </html>
        `;
    },
    PAGE:function(pid,title,res,author,time,body){
        
        var listhtml = getlisthtml(res)
        
        return `
            <!doctype html>
            <html>
            <head>
                <title>${title} - 주커게시판</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1>${title}</h1>
                <p>${author} | ${time}</p>
                <p>${body}</p>
                <a href="/board/create">글쓰기</a>
                <a href="/board/update/${pid}">수정</a>
                <form action="/board/delete_process" method="post">
                  <input type="hidden" name="id" value="${pid}">
                  <input type="submit" value="삭제">
                </form>
                <p><a href="/board">글목록</a></p>
                <p>${listhtml}</p>
            </body>
            </html>
        `;
    },
    CREATE:function(){
        return `
            <!doctype html>
            <html>
            <head>
                <title>게시판</title>
                <meta charset="utf-8">
            </head>
            <body>
            <form action="/board/create_process" method="post">
                <p><input type="text" name="title" placeholder="제목입니다."></p>
                <p><input type="text" name="author" placeholder="작성자입니다."></p>
                <p>
                    <textarea name="content" placeholder="내용"></textarea>
                </p>
                <p>
                    <input type="submit" value="등록">
                </p>
            </form>
            </body>
            </html>
        `;
    },
    UPDATE:function(pid,title,res,author,time,body){
        var listhtml = getlisthtml(res)

        return `
            <!doctype html>
            <html>
            <head>
                <title>${title} - 주커게시판</title>
                <meta charset="utf-8">
            </head>
            <body>
                <form action="/board/update_process" method="post">
                    <input type="hidden" name="id" value="${pid}">
                    <p><input type="text" name="title" placeholder="제목을 입력해주세요." value="${title}"></p>
                    <p>${author} | ${time}</p>
                    <p>
                    <textarea name="content">${body}</textarea>
                    </p>
                    <p>
                    <input type="submit" value="수정완료">
                    </p>
                </form>
                <p><a href="/board">글목록</a></p>
                <p>${listhtml}</p>
            </body>
            </html>
        `;
    }
}
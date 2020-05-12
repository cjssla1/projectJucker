var express = require('express');
var router = express.Router();
var boardhtml = require('../views/boardhtml');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var mysql = require('mysql2/promise');
const db = mysql.createPool({
  host      : 'localhost',
  user      : 'webadmin',
  password  : '1234',
  database  : 'web',
  waitForConnections: true,
  connectionLimit: 10,
});

// 목록 가져오는 쿼리 함수화
const getArticleList = async function(){
  const articlelist = await db.execute(`SELECT * FROM board LIMIT 10`)
  return articlelist[0];
}



router.get('/create', function(req, res, next) {
  var html = boardhtml.CREATE()
  res.send(html)
});

router.post('/create_process', async function(req, res, next) {
  var post = req.body;
  var pid;

  const conn = await db.getConnection();
  try{
    await conn.beginTransaction();
    const sel = await conn.execute(`SELECT id from board ORDER BY id DESC LIMIT 1`);
    pid = sel[0][0].id+1

    const ins = await conn.execute(`
    INSERT INTO board (id, author, title, content,time) 
      VALUES(?, ?, ?, ?, NOW())`,
    [pid, post.author, post.title, post.content])
    await conn.commit()

    res.writeHead(302, {Location: `/board/page/${pid}`});
    res.end();
  }catch(err){
    conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
  
});

router.get('/update/:pageid', async function(req, res, next) {
  var filteredId = path.parse(req.params.pageid).base;
  var sanitizeTitle;
  var sanitizeContent;
  var author;
  var time;

  const sel = await db.execute(`SELECT * FROM board WHERE id=?`,[filteredId]);
  sanitizeTitle = sanitizeHtml(sel[0][0].title);
  sanitizeContent = sanitizeHtml(sel[0][0].content);     
  author = sel[0][0].author;
  time = sel[0][0].time;

  var articlelist = await getArticleList();
  var html = boardhtml.UPDATE(filteredId,sanitizeTitle,articlelist,author,time,sanitizeContent)
  res.send(html)
  
});

router.post('/update_process', async function(req, res, next) {
  var post = req.body;
  
  const conn = await db.getConnection();
  try{
    await conn.beginTransaction();
    
    const upd = await conn.execute(`UPDATE board SET title = ?, content = ? WHERE id = ?`,
    [post.title, post.content, post.id])
    await conn.commit()

    res.writeHead(302, {Location: `/board/page/${post.id}`});
    res.end();
  }catch(err){
    conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }

});

router.post('/delete_process', async function(req, res, next) {
  var post = req.body;
  
  const conn = await db.getConnection();
  try{
    await conn.beginTransaction();
    
    const del = await conn.execute(`DELETE FROM board WHERE id = ?`,[post.id])
    await conn.commit()

    res.writeHead(302, {Location: `/board`});
    res.end();
  }catch(err){
    conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }

});



router.get('/page/:pageid', async function(req, res, next) {
  var filteredId = path.parse(req.params.pageid).base;
  var sanitizeTitle;
  var sanitizeContent;
  var author;
  var time;

  const article = await db.execute(`SELECT * FROM board WHERE id=?`,[filteredId])
  sanitizeTitle = sanitizeHtml(article[0][0].title);
  sanitizeContent = sanitizeHtml(article[0][0].content);     
  author = article[0][0].author;
  time = article[0][0].time;

  const articlelist = await getArticleList();
  var html = boardhtml.PAGE(filteredId,sanitizeTitle,articlelist,author,time,sanitizeContent);
  res.send(html)
});


/* GET users listing. */
router.get('/', async function(req, res, next) {
  const articlelist = await getArticleList();
  var html = boardhtml.BoardHome('글목록',articlelist,'');
  res.send(html);
});

module.exports = router;

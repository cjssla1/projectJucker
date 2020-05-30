const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const path = require('path');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host      : 'localhost',
  user      : 'webadmin',
  password  : '1234',
  database  : 'web',
  waitForConnections: true,
  connectionLimit: 10,
});
/*
const db = mysql.createPool({
  host      : 'jukerdb.cwhsnjoqybdo.ap-northeast-2.rds.amazonaws.com',
  user      : 'admin',
  password  : ,
  database  : ,
  port      : ,
  waitForConnections: true,
  connectionLimit: 10,
});
*/
// 목록 가져오는 쿼리 함수화
const getArticleList = async function(){
  const articlelist = await db.execute(`SELECT * FROM board LIMIT 10`)
  return articlelist[0];
}



router.post('/create_process', async function(req, res, next) {
  var post = req.body;
  var pid;

  try{
    const conn = await db.getConnection();
    await conn.beginTransaction();
    const sel = await conn.execute(`SELECT pageid from board ORDER BY pageid DESC LIMIT 1`);
    pid = sel[0][0].pageid+1

    const ins = await conn.execute(`
    INSERT INTO board (author, title, content,time) 
      VALUES(?, ?, ?, NOW())`,
    [post.author, post.title, post.content])
    await conn.commit()

    res.writeHead(302, {Location: `/board/read/${pid}`});
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

  const sel = await db.execute(`SELECT * FROM board WHERE pageid=?`,[filteredId]);
  const pageid = sel[0][0].pageid;
  const sanitizeTitle = sanitizeHtml(sel[0][0].title);
  const sanitizeContent = sanitizeHtml(sel[0][0].content);     
  const author = sel[0][0].author;
  const time = sel[0][0].time;

  res.json({pageid,sanitizeTitle,sanitizeContent,author,time});
});

router.post('/update_process', async function(req, res, next) {
  var post = req.body;
  
  try{
    const conn = await db.getConnection();
    await conn.beginTransaction();
    
    const upd = await conn.execute(`UPDATE board SET title = ?, content = ? WHERE pageid = ?`,
    [post.title, post.content, post.id])
    await conn.commit()

    res.writeHead(302, {Location: `/board/read/${post.id}`});
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
  
  try{
    const conn = await db.getConnection();
    await conn.beginTransaction();
    
    const del = await conn.execute(`DELETE FROM board WHERE pageid = ?`,[post.id])
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



router.get('/read/:pageid', async function(req, res, next) {
  const filteredId = path.parse(req.params.pageid).base;
  
  const article = await db.execute(`SELECT * FROM board WHERE pageid=?`,[filteredId])
  const pageid = article[0][0].pageid;
  const sanitizeTitle = sanitizeHtml(article[0][0].title);
  const sanitizeContent = sanitizeHtml(article[0][0].content);     
  const author = article[0][0].author;
  const time = article[0][0].time;

  res.json({pageid,sanitizeTitle,sanitizeContent,author,time});
});


/* GET users listing. */
router.get('/', async function(req, res, next) {
  const articlelist = await getArticleList();
  res.json(articlelist);
});

module.exports = router;

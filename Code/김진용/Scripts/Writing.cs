using MySql.Data.MySqlClient;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Writing : MonoBehaviour
{
    public InputField titleInput;
    public InputField contentInput;
    public InputField idInput;
    public InputField pwdInput;
    string title;
    string content;
    string author;
    string id;
    string pwd;
    MySqlConnection conn;
    MySqlDataReader rdr;

    void Start()
    {
        check();
    }
    void Update()
    {
        check();
    }
    void check()
    {
        if(Login.loginStatus == true)
        {
            idInput.gameObject.SetActive(false);
            pwdInput.gameObject.SetActive(false);
        }
        else
        {
            idInput.gameObject.SetActive(true);
            pwdInput.gameObject.SetActive(true);
        }
    }
    public void summit()
    {
        title = titleInput.text;
        content = contentInput.text;
        author = Login.loginID;
        id = idInput.text;
        pwd = pwdInput.text;
        inputDB();
    }
    void inputDB()
    {
        string strconn = "Server=localhost;Database=stock;Uid=admin;Pwd=w3084926;Charset=utf8";
        conn = new MySqlConnection(strconn);
        conn.Open();
        MySqlCommand cmd = new MySqlCommand("INSERT INTO board(title, content, author, id, pwd) values(\'" + title + "\', " +
            "\'" + content + "\', " +
            "\'" + author + "\', " +
            "\'" + id + "\', " +
            "\'" + pwd + "\');", conn);
        cmd.ExecuteNonQuery();
    }
}

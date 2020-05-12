using MySql.Data.MySqlClient;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Writing : MonoBehaviour
{
    public InputField titleInput;
    public InputField contentInput;
    string title;
    string content;
    MySqlConnection conn;
    MySqlDataReader rdr;

    public void summit()
    {
        title = titleInput.text;
        content = contentInput.text;
        if(title.Length != 0 && title.Length <= 20)
        {
            inputDB();
        }
        else
        {
            if (title.Length > 20)
            {
                Debug.LogError("제목은 20자 이내입니다.");
            }
            else
            {
                Debug.LogError("제목이 입력되지 않았습니다.");
            }
        }
    }
    void inputDB()
    {
        string strconn = "Server=localhost;Database=stock;Uid=root;Pwd=w3084926;Charset=utf8";
        conn = new MySqlConnection(strconn);
        conn.Open();
        MySqlCommand cmd = new MySqlCommand("INSERT INTO board(title, content) values(\'" + title + "\', \'" + content + "\');", conn);
        cmd.ExecuteNonQuery();
    }
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}

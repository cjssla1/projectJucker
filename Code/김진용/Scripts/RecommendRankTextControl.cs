using MySql.Data.MySqlClient;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class RecommendRankTextControl : MonoBehaviour
{
    MySqlConnection conn;
    MySqlDataReader rdr;

    public Text first;
    public Text second;
    public Text third;
    public Text forth;
    public Text fifth;

    private void openMysql()
    {
        string strconn = "Server=localhost;Database=stock;Uid=root;Pwd=w3084926;Charset=utf8";
        conn = new MySqlConnection(strconn);
        conn.Open();
        Debug.Log("connect success!");
        MySqlCommand cmd = new MySqlCommand("SELECT * from board order by recommend desc;", conn);
        rdr = cmd.ExecuteReader();
        Debug.Log("SELECT success!");
        for (int i = 0; i < 5; i++)
        {
            rdr.Read();
            if (i == 0) { first.text = rdr["title"].ToString(); }
            if (i == 1) { second.text = rdr["title"].ToString(); }
            if (i == 2) { third.text = rdr["title"].ToString(); }
            if (i == 3) { forth.text = rdr["title"].ToString(); }
            if (i == 4) { fifth.text = rdr["title"].ToString(); }
        }
        rdr.Close();
        conn.Close();
    }
    void Start()
    {
        openMysql();
    }

    // Update is called once per frame
    void Update()
    {

    }
}

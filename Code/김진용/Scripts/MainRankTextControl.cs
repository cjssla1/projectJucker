using MySql.Data.MySqlClient;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MainRankTextControl : MonoBehaviour
{
    MySqlConnection conn;
    MySqlDataReader rdr;

    public Text s_first;
    public Text s_second;
    public Text s_third;
    public Text s_forth;
    public Text s_fifth;
    public Text r_first;
    public Text r_second;
    public Text r_third;
    public Text r_forth;
    public Text r_fifth;

    void setStockRank()
    {
        string strconn = "Server=localhost;Database=stock;Uid=root;Pwd=w3084926;Charset=utf8";
        conn = new MySqlConnection(strconn);
        conn.Open();
        Debug.Log("connect success!");
        MySqlCommand cmd = new MySqlCommand("SELECT * from rawdata order by profit desc;", conn);
        rdr = cmd.ExecuteReader();
        Debug.Log("s_rank SELECT success!");
        for(int i = 0; i < 5; i++)
        {
            rdr.Read();
            if (i == 0) { s_first.text = rdr["name"].ToString(); }
            if (i == 1) { s_second.text = rdr["name"].ToString(); }
            if (i == 2) { s_third.text = rdr["name"].ToString(); }
            if (i == 3) { s_forth.text = rdr["name"].ToString(); }
            if (i == 4) { s_fifth.text = rdr["name"].ToString(); }
        }
        rdr.Close();
        conn.Close();
    }
    void setRcmdRank()
    {
        string strconn = "Server=localhost;Database=stock;Uid=root;Pwd=w3084926;Charset=utf8";
        conn = new MySqlConnection(strconn);
        conn.Open();
        Debug.Log("connect success!");
        MySqlCommand cmd = new MySqlCommand("SELECT * from board order by recommend desc;", conn);
        rdr = cmd.ExecuteReader();
        Debug.Log("r_rank SELECT success!");
        for (int i = 0; i < 5; i++)
        {
            rdr.Read();
            if (i == 0) { r_first.text = rdr["title"].ToString(); }
            if (i == 1) { r_second.text = rdr["title"].ToString(); }
            if (i == 2) { r_third.text = rdr["title"].ToString(); }
            if (i == 3) { r_forth.text = rdr["title"].ToString(); }
            if (i == 4) { r_fifth.text = rdr["title"].ToString(); }
        }
        rdr.Close();
        conn.Close();
    }
    void Start()
    {
        setStockRank();
        setRcmdRank();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MySql.Data.MySqlClient;
using UnityEditor;
using System;
using UnityEngine.UI;
using System.Dynamic;
using System.ComponentModel;

public class MysqlTest : MonoBehaviour
{
    MySqlConnection conn;
    private void openMysql()
    {
        string strconn = "Server=localhost;Database=stock;Uid=root;Pwd=w3084926;";
        conn = new MySqlConnection(strconn);
        conn.OpenAsync();
        Debug.Log("success!");
        MySqlCommand cmd = new MySqlCommand("show databases;", conn);
        MySqlDataReader rdr = cmd.ExecuteReader();
        while (rdr.Read())
        {
            Debug.Log(rdr[0]);
        }
        rdr.Close();
        conn.Close();
    }
    private void Start()
    {
        openMysql();
    }
}
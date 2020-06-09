using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using MySql.Data.MySqlClient;
using UnityEngine.SceneManagement;

public class Login : MonoBehaviour
{
    MySqlConnection conn;
    MySqlDataReader rdr;
    public static bool loginStatus = false;
    public static string loginID = "";

    [Header("Login")]
    public InputField id;
    public InputField pwd;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void loginClick()
    {
        StartCoroutine(loginCo());
    }

    IEnumerator loginCo()
    {
        string strconn = "Server=localhost;Database=stock;Uid=admin;Pwd=w3084926;Charset=utf8";
        conn = new MySqlConnection(strconn);
        conn.Open();
        Debug.Log("connect success!");

        string inputID = id.text;
        string inputPwd = pwd.text;

        MySqlCommand cmd = new MySqlCommand("SELECT id, pwd from customer where id = \'" + id.text + "\';", conn);
        rdr = cmd.ExecuteReader();

        if (rdr.Read())
        {
            if(inputPwd == rdr["pwd"].ToString())
            {
                Login.loginID = rdr["id"].ToString();
                Login.loginStatus = true;
                SceneManager.LoadScene("2_Navigation");
            }
            else
            {
                Debug.Log("비밀번호가 틀립니다.");
            }
        }
        else
        {
            Debug.Log("존재하지 않는 계정입니다.");
        }

        yield return null;
    }
}

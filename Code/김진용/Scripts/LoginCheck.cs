using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LoginCheck : MonoBehaviour
{
    public Text account;
    public Button logoutBtn;

    // Start is called before the first frame update
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
        if (Login.loginStatus == true)
        {
            account.gameObject.SetActive(true);
            logoutBtn.gameObject.SetActive(true);
            account.text = Login.loginID + "님";
        }
        else
        {
            account.gameObject.SetActive(false);
            logoutBtn.gameObject.SetActive(false);
        }
    }

    public void logout()
    {
        Login.loginStatus = false;
        Login.loginID = "";
    }
}

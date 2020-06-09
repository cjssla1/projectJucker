using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class FindIDController : MonoBehaviour
{
    public void naviClick()
    {
        SceneManager.LoadScene("2_Navigation");
    }
    public void signUpClick()
    {
        SceneManager.LoadScene("4_SignUp");
    }

    public void findPwd()
    {
        SceneManager.LoadScene("6_FindPwd");
    }

    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }
}

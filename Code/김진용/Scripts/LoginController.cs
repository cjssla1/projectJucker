using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LoginController : MonoBehaviour
{
    public void naviClick()
    {
        SceneManager.LoadScene("2_Navigation");
    }
    public void signUpClick()
    {
        SceneManager.LoadScene("4_SignUp");
    }

    public void findClick()
    {
        SceneManager.LoadScene("5_FindID");
    }
}

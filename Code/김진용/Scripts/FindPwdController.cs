using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class FindPwdController : MonoBehaviour
{
    public void naviClick()
    {
        SceneManager.LoadScene("2_Navigation");
    }
    public void signUpClick()
    {
        SceneManager.LoadScene("4_SignUp");
    }

    public void findIDClick()
    {
        SceneManager.LoadScene("5_FindID");
    }
}

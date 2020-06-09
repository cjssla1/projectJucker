using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class NavigationController : MonoBehaviour
{
    void Start()
    {

    }
    public void testClick()
    {
        SceneManager.LoadScene("13_Write");
    }
    public void loginClick()
    {
        SceneManager.LoadScene("3_Login");
    }  

    public void expectClick()
    {
        SceneManager.LoadScene("9_Expect");
    }

    public void recommendClick()
    {
        SceneManager.LoadScene("11_BoardRecommendMain");
    }

    public void normalClick()
    {
        SceneManager.LoadScene("10_BoardNormalMain");
    }

    public void infoClick()
    {
        SceneManager.LoadScene("7_InfoMain");
    }
}

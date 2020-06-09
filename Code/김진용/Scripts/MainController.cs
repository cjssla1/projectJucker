using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainController : MonoBehaviour
{
    public void naviClick()
    {
        SceneManager.LoadScene("2_Navigation");
    }
    public void expectClick()
    {
        SceneManager.LoadScene("9_Expect");
    }
}

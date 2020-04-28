using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainUImanager : MonoBehaviour
{
    public void stockClick()
    {
        Debug.Log("2_StockUp called");
        SceneManager.LoadScene("2_StockUp");
    }
    public void boardClick()
    {
        Debug.Log("4_BoardNormal called");
        SceneManager.LoadScene("4_BoardNormal");
    }
}

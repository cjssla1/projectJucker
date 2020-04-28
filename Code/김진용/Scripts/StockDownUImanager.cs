using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class StockDownUImanager : MonoBehaviour
{
    public void upClick()
    {
        Debug.Log("2_StockUp called");
        SceneManager.LoadScene("2_StockUp");
    }

    public void boardClick()
    {
        Debug.Log("4_BoardNormal called");
        SceneManager.LoadScene("4_BoardNormal");
    }

    public void backClick()
    {
        Debug.Log("1_Main called");
        SceneManager.LoadScene("1_Main");
    }
}

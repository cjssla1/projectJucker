using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class StockUpUImanager : MonoBehaviour
{
    public void downClick()
    {
        Debug.Log("3_StockDown called");
        SceneManager.LoadScene("3_StockDown");
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

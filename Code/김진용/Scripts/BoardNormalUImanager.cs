using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class BoardNormalUImanager : MonoBehaviour
{
    public void stockClick()
    {
        Debug.Log("2_StockUp called");
        SceneManager.LoadScene("2_StockUp");
    }  

    public void recommendClick()
    {
        Debug.Log("5_BoardRecommend called");
        SceneManager.LoadScene("5_BoardRecommend");
    }

    public void backClick()
    {
        Debug.Log("1_Main called");
        SceneManager.LoadScene("1_Main");
    }
}

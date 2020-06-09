using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class WritingUImanager : MonoBehaviour
{
    public void backClick()
    {
        Debug.Log("4_BoardNormal called");
        SceneManager.LoadScene("4_BoardNormal");
    }
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frameW
}

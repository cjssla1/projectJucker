import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class CreateButton extends Component{
    
    render(){

        return(
            <div>
                <Link to="/board/create"><button type="button">글작성</button></Link>
            </div>
        )
    }
}

export default CreateButton;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class ListButton extends Component{
    
    render(){

        return(
            <span>
                <Link to="/board"><button type="button">글목록</button></Link>
            </span>
        )
    }
}

export default ListButton;
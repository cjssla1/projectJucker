import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UpdateButton extends Component{
    
    constructor(props){
        super(props);
        this.state ={
          id:this.props.id
        };
      }

    render(){

        return(
            <span>
                <Link to={`/board/update/${this.state.id}`}><button type="button">수정</button></Link>
            </span>
        )
    }
}

export default UpdateButton;
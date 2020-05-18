import React, { Component } from 'react';


class DeleteButton extends Component{
    constructor(props){
        super(props);
        this.state ={
            id:this.props.id
        };
    }

    async handleSubmit(e){
        e.preventDefault();
        try{
            await this.sendtoServer()
        } catch(err){
            console.error(err)
        }
    }

    sendtoServer(){
        fetch('/board/delete_process',{
            method: 'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            redirect:'follow',
            body: JSON.stringify({id:this.state.id})
        })
        .then(res=>window.location.href = res.url)
        .catch(err=>console.log(err))
    }
  
    render(){

        return(
            <span>
                <button type="button" onClick={this.handleSubmit.bind(this)}>삭제</button>
            </span>
        )
    }
}

export default DeleteButton;
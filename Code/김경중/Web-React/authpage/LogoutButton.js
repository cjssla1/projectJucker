import React, { Component } from 'react';


class LogoutButton extends Component{

    async handleSubmit(e){
        e.preventDefault();
        try{
            await this.sendtoServer()
        } catch(err){
            console.error(err)
        }
    }

    sendtoServer(){
        fetch('/auth/logout',{
            method: 'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            redirect:'follow'
        })
        .then(res=>window.location.href = res.url)
        .catch(err=>console.log(err))
    }
  
    render(){

        return(
            <span>
                <button type="button" onClick={this.handleSubmit.bind(this)}>Logout</button>
            </span>
        )
    }
}

export default LogoutButton;
import React, { Component } from 'react';

class Login extends Component {
  constructor(props){
    super(props);
    this.state ={
      id:null,
      password:null,
      error:null
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
    console.log(this.state.id)
    fetch('/auth/login_process',{
        method: 'post',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        redirect:'follow',
        body: JSON.stringify({id:this.state.id,password:this.state.password})
    })
    .then(res=>window.location.href = res.url)
    .catch(err=>console.log(err))
  }

  componentDidMount(){
    fetch('/auth/error')
      .then(res=>res.json())
      .then(data=>{
        this.setState({
          error:data
        })
      })
  }

  render() {
    
    var errorlog = null;
    if(this.state.error) errorlog = this.state.error;
    
    return (
      <div className="Auth-login">
        <div className="login-header">
          로그인
        </div>
        <form method="post" onSubmit={this.handleSubmit.bind(this)}>
                <p><input type="text" name="id" placeholder="ID" onChange={function(e){this.setState({id:e.target.value})}.bind(this)}></input></p>
                <p><input type="password" name="password" placeholder="Password" onChange={function(e){this.setState({password:e.target.value})}.bind(this)}></input></p>
                <p>{errorlog}</p>
                <p>
                    <input type="submit" value="로그인"></input>
                </p>
            </form>
      </div>
    );
  }
}

export default Login;

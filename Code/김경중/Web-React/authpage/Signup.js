import React, { Component } from 'react';

class Signup extends Component {
  constructor(props){
    super(props);
    this.state ={
      id:null,
      password:null,
      password2:null,
      email:null,
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
    fetch('/auth/signup_process',{
        method: 'post',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        redirect:'follow',
        body: JSON.stringify({
          id:this.state.id,
          password:this.state.password,
          password2:this.state.password2,
          email:this.state.email})
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
        if(this.state.error){
          alert(this.state.error)
          this.setState({error:null})
        }
      })
  }

  render() {

    var pwdcheck = null;
    if (this.state.password !== this.state.password2 && this.state.password2 && this.state.password) 
      pwdcheck = '비밀번호가 다릅니다.';

    return (
      <div className="Auth-login">
        <div className="login-header">
          회원가입
        </div>
        <form method="post" onSubmit={this.handleSubmit.bind(this)}>
                <p><input type="text" name="id" placeholder="ID" onChange={function(e){this.setState({id:e.target.value})}.bind(this)}></input></p>
                <p><input type="password" name="password" placeholder="Password" onChange={function(e){this.setState({password:e.target.value})}.bind(this)}></input></p>
                <p><input type="password" name="password2" placeholder="Password Conform" onChange={function(e){this.setState({password2:e.target.value})}.bind(this)}></input></p>
                <p><input type="text" name="email" placeholder="Email" onChange={function(e){this.setState({email:e.target.value})}.bind(this)}></input></p>
                <p>{pwdcheck}</p>
                <p>
                    <input type="submit" value="회원등록"></input>
                </p>
            </form>
      </div>
    );
  }
}

export default Signup;

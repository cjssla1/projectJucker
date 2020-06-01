import React, { Component } from 'react';

class Signup extends Component {

  render() {    
    return (
      <div className="Auth-login">
        <div className="login-header">
          회원가입
        </div>
        <form method="post">
                <p><input type="text" name="id" placeholder="ID" ></input></p>
                <p><input type="password" name="password" placeholder="Password" ></input></p>
                <p><input type="password" name="password2" placeholder="Password Conform" ></input></p>
                <p><input type="text" name="email" placeholder="Email" ></input></p>
                <p>
                    <input type="submit" value="회원등록"></input>
                </p>
            </form>
      </div>
    );
  }
}

export default Signup;

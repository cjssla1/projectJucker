import React, { Component } from 'react';

class Login extends Component {

  render() {    
    return (
      <div className="Auth-login">
        <div className="login-header">
          로그인
        </div>
        <form method="post">
                <p><input type="text" name="id" placeholder="ID" ></input></p>
                <p><input type="text" name="password" placeholder="Password" ></input></p>
                <p>
                    <input type="submit" value="로그인"></input>
                </p>
            </form>
      </div>
    );
  }
}

export default Login;

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Board from './boardpage/Board';
import Rank from './rankpage/Rank';
import ReadPage from './boardpage/ReadPage';
import Create from './boardpage/Create';
import Update from './boardpage/Update';
import Login from './authpage/Login';
import Signup from './authpage/Signup';
import LogoutButton from './authpage/LogoutButton';
import Notfound from './homepage/Notfound';
import Home from './homepage/Home';

class Routes extends Component{

    constructor(props){
        super(props);
        this.state ={
          session:null
        };
      }
      componentDidMount(){
        fetch('/auth')
          .then(res=>res.json())
          .then(data=>{
            console.log(data)
            this.setState({
              session:data
            })
          })
      }

    render(){
        var auth1 = ''
        var auth2 = ''
        if(this.state.session){
            auth1 = this.state.session.nickname
            auth2 = <LogoutButton></LogoutButton>
        } else{
            auth1 = <Link to="/auth/login">Login</Link>
            auth2 = <Link to="/auth/signup">SignUp</Link>
        }

        return(
        <div className="Routes">
        <Router>
            <div><Link to="/">홈페이지</Link></div>
            <div>{auth1}</div>
            <div>{auth2}</div>
            <div><Link to="/rank">주식랭킹</Link></div>
            <div><Link to="/board">게시판</Link></div>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/auth/login" component={Login}></Route>
            <Route exact path="/auth/signup" component={Signup}></Route>
            <Route exact path="/rank" component={Rank}></Route>
            <Route exact path="/board" component={Board}></Route>
            <Route exact path="/board/create" component={Create}></Route>
            <Route exact path="/board/read/:id" component={ReadPage}></Route>
            <Route exact path="/board/update/:id" component={Update}></Route>
            <Route component={Notfound}></Route>
          </Switch>
        </Router>
        </div>
        );
    }
}

export default Routes;
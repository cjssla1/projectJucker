import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Board from './boardpage/Board';
import Rank from './rankpage/Rank';
import ReadPage from './boardpage/ReadPage';
class Routes extends Component{
    render(){
        return(
        <div className="Routes">
        <Router>
            <ul>
                <li><Link to="/rank">주식랭킹</Link></li>
                <li><Link to="/board">게시판</Link></li>
            </ul>
            <Route exact path="/rank" component={Rank}></Route>
            <Route exact path="/board" component={Board}></Route>
            <Route exact path="/board/page/:id" component={ReadPage}></Route>
        </Router>
        </div>
        );
    }
}

export default Routes;
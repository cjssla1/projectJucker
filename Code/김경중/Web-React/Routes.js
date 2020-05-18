import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Board from './boardpage/Board';
import Rank from './rankpage/Rank';
import ReadPage from './boardpage/ReadPage';
import Create from './boardpage/Create';
import Update from './boardpage/Update';

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
            <Route exact path="/board/create" component={Create}></Route>
            <Route exact path="/board/read/:id" component={ReadPage}></Route>
            <Route exact path="/board/update/:id" component={Update}></Route>
        </Router>
        </div>
        );
    }
}

export default Routes;
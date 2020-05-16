import React, { Component } from 'react';
import Articlelist from './Articlelist';

class Board extends Component {

  render() {
    
    return (
      <div className="Board">
        <div className="Board-header">
          게시판 홈
        </div>
        <div>
          <Articlelist></Articlelist>
        </div>
      </div>
    );
  }
}

export default Board;

import React, { Component } from 'react';
import Articlelist from './Articlelist';
import CreateButton from './CreateButton';

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
        <div>
          <CreateButton></CreateButton>
        </div>
      </div>
    );
  }
}

export default Board;

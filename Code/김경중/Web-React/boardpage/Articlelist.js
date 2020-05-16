import React, { Component } from 'react';
import { BrowserRouter as Router,Link } from 'react-router-dom';

class Articlelist extends Component{
    constructor(props){
      super(props);
      this.state ={
        articlelist:[]
      };
    }
  
    componentDidMount(){
      fetch('board')
        .then(res=>res.json())
        .then(data=>{
          this.setState({
            articlelist:data
          })
        })
    }
  
    render() {
      const data = this.state.articlelist;
      var lists = []
      if(data){
        for(var i =0; i < data.length;i++){
          lists.push(
            <li key={data[i].id}>
              <Link to={`/board/page/${data[i].id}`}>
                작성자:{data[i].author}   제목:{data[i].title}         시간:{data[i].time}
              </Link>
            </li>
          );
        }
      }
      return (
        <div className="ArticleList">
          <ul>
            목록
            {lists}
          </ul>
        </div>
      );
    }
  }
  
export default Articlelist;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Update extends Component{
    constructor(props){
      super(props);
      this.state ={
        id:this.props.match.params.id,
        title:null,
        author:null,
        content:null,
        time:null
      };
    }

    //정보 가져오기
    componentDidMount(){
        fetch(this.state.id)
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    id:data.pageid,
                    author:data.author,
                    title:data.sanitizeTitle,
                    content:data.sanitizeContent,
                    time:data.time
                })
            })
        
    }

    // 갱신하기
    async handleSubmit(e){
        e.preventDefault();
        try{
            await this.sendtoServer()
        } catch(err){
            console.error(err)
        }
    }
    // 갱신하기 2
    sendtoServer(){
        fetch('/board/update_process',{
            method: 'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            redirect:'follow',
            body: JSON.stringify({id:this.state.id,title:this.state.title,content:this.state.content})
        })
        .then(res=>window.location.href = res.url)
        .catch(err=>console.log(err))
    }
  
    render() {
      console.log(this.state.id)
      console.log(this.state.author)
      console.log(this.state.title)
      console.log(this.state.content)
      console.log(this.state.time)
      return (
        <div className="Create">
          <ul>
            <form method="post" onSubmit={this.handleSubmit.bind(this)}>
                <p>제목 :<input type="text" name="title" placeholder={this.state.title} onChange={function(e){this.setState({title:e.target.value})}.bind(this)}></input></p>
                <p>작성자 :{this.state.author}</p>
                <p>
                    <textarea name="content" placeholder={this.state.content} onChange={function(e){this.setState({content:e.target.value})}.bind(this)}></textarea>
                </p>
                <p>
                    <input type="submit" value="등록"></input>
                    <Link to={`/board/read/${this.state.id}`}><button type="button">취소</button></Link>
                </p>
            </form>
          </ul>
        </div>
      );
    }
  }
  
export default Update;
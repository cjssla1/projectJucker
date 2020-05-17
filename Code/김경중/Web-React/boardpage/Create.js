import React, { Component } from 'react';

class Create extends Component{
    constructor(props){
      super(props);
      this.state ={
        title:"title",
        author:"author",
        content:"desc"
      };
    }

    async handleSubmit(e){
        e.preventDefault();
        try{
            const res = await this.sendtoServer()
            console.log(res)
        } catch(err){
            console.error(err)
        }
    }

    sendtoServer(){
        fetch('/board/create_process',{
            method: 'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            redirect:'follow',
            body: JSON.stringify({title:this.state.title,author:this.state.author,content:this.state.content})
        })
        .then(res=>window.location.href = res.url)
        .catch(err=>console.log(err))
    }
  
    render() {
      
      return (
        <div className="Create">
          <ul>
            <form method="post" onSubmit={this.handleSubmit.bind(this)}>
                <p><input type="text" name="title" placehodler="글 제목을 입력해주세요" onChange={function(e){this.setState({title:e.target.value})}.bind(this)}></input></p>
                <p><input type="text" name="author" placehodler="작성자" onChange={function(e){this.setState({author:e.target.value})}.bind(this)}></input></p>
                <p>
                    <textarea name ="content" onChange={function(e){this.setState({content:e.target.value})}.bind(this)}></textarea>
                </p>
                <p>
                    <input type="submit" value="등록"></input>
                </p>
            </form>
          </ul>
        </div>
      );
    }
  }
  
export default Create;
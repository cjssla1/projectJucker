import React, { Component } from 'react';

class ReadPage extends Component{
    constructor(props){
        super(props);
        this.state ={
            id:this.props.match.params.id,
            author:null,
            title:null,
            content:null,
            time:null
        };
    }
    
    //filteredId,sanitizeTitle,sanitizeContent,author,time
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

    render(){
        const _id = this.state.id
        const _title = this.state.title
        const _content = this.state.content
        const _author = this.state.author
        const _time = this.state.time

        return(
            <div>
                글 내용 보여주는 페이지
                <div>글번호 : {_id}</div>
                <div>제목 : {_title}</div>
                <div>내용 :{_content}</div>
                <div>작성자 :{_author}</div>
                <div>작성 시간:{_time}</div>
            </div>
        )
    }
}

export default ReadPage;
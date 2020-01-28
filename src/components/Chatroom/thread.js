import React, { Component } from 'react';
import { withAuthorization } from '../Session/session';
import { withAuth } from '../Session/session-context';
import * as firebase from 'firebase'

import { Form, FormControl, Button, InputGroup } from 'react-bootstrap';

class Thread extends Component {
  constructor(props){
    super(props);
    console.log(props);
    
    this.state = {
      text: '',
      currentUsername: localStorage.username,
      messageList: [],
      active: this.props.active
    }
    console.log(this.state.active);

  }


  componentDidMount() {
    // this.setState({active: this.props.active})
    const db = this.props.firebase.db;
    const threadId = this.props.active
    if (!threadId) {
      return '';
    }
    db.collection('chatRooms').doc(threadId).onSnapshot(response => {
      // if (response.data().messages !== null) {
        this.setState({messageList: response.data().messages})
        this._newMessage();  
    })
    
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevProps.active);
    
    // console.log(this.props.active);
    
    // this.setState({active: this.props.active})
    if (this.props.active !== prevProps.active) {
    console.log(prevProps.active);
    console.log(this.props.active);


      const db = this.props.firebase.db;
      const threadId = this.props.active
      if (!threadId) {
        return '';
      }
      db.collection('chatRooms').doc(threadId).onSnapshot(response => {
        // if (response.data().messages !== null) {
          this.setState({messageList: response.data().messages})
          this._newMessage();
          console.log('here-thread');
          
      })
    } 
  }

  _handleInput = (e) => {
    this.setState({text: e.target.value})
  }

  _handleSubmit = (event) => {
    event.preventDefault();

    const db = this.props.firebase.db;
    const threadId = this.props.active
    const newText = {
      time: new Date(),
      from: this.state.currentUsername,
      text: this.state.text
    }
    const thread = db.collection('chatRooms').doc(threadId)
    thread.update({
      messages: firebase.firestore.FieldValue.arrayUnion(newText)
    })
    db.collection('chatRooms').doc(threadId).update({
      seen: false, 
      time: new Date()
    }).then(() => {
      console.log('next');
      
    });
    this.setState({text: ''});

  }

  _newMessage = () => {
    let container = document.querySelector('.container');
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }

  render() {
    const db = this.props.firebase.db;
    const messageList = this.state.messageList;
    const messages = messageList.map(m => {
      let time = m.time;
      let realTime = time.toDate() + "";
      let correct = realTime.slice(0, 24)
      let position = "left";
      if (m.from === localStorage.username) {
        position = "right"
      };

      return <div className={position} key={time.toDate()}><p>{m.text}</p><p className="time">{correct}</p></div>
      console.log('message lists');
      
    })



    return(
      <div className="message-window">
        <div className="thread-col">
        {messages}
        </div>
        <Form className="message-field" onSubmit={this._handleSubmit}>
          <InputGroup className="">
            <FormControl
              placeholder="Type message..."
              aria-label="Message field"
              aria-describedby="basic-addon2"
              onChange={ this._handleInput }
              value={ this.state.text }
            />
            <InputGroup.Append>
              <Button type="submit" variant="outline-primary">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </div>
    )
  }

}


const condition = authUser => !!authUser;

export default withAuth(withAuthorization(condition)(Thread));

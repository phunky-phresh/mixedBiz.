import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session/session';
import { withAuth } from '../Session/session-context';
import AccountForm from './accountForm';
import { PasswordForgetForm } from './pwordforget';
import PasswordChangeForm from './pwordchange';

import { Button } from 'react-bootstrap';

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.authUser.uid,
      view: '',
      username: null,
      email: null,
      phone: null,
      address: null
    }
    console.log(this.state.view);
  }

  componentDidMount() {
    const db = this.props.firebase.db
    const user = db.collection('users').doc(this.state.currentUser)
    user.get().then((response) => {
      this.setState({
        username: response.data().username,
        email: response.data().email,
        phone: response.data().phone,
        address: response.data().address
      });
    })

    // users.get().then((response) => {
    //   response.forEach( u => console.log(u.data()))
    // })
  }
  _handleViewReset = () => {
    this.setState({view: ''})
  }
  _handleFormView = () => {
    this.setState({view: 'form'})
  }
  _handleSetView = () => {
    this.setState({view: 'settings'})
    console.log('set');
  }
  render() {
    let view = this.state.view
    if (view === 'form') {
      return(
        <AccountForm view={this._handleViewReset}/>
      )
    } else if (view === 'settings') {
      return(
        <Settings />
      )
    } else {
      return(
        <div>
          <h1>{this.state.username}</h1>
          <h1>Email: {this.state.email}</h1>
          <h1>Mobile: {this.state.phone}</h1>
          <h1>Address: {this.state.address}</h1>
          <Button onClick={this._handleFormView}>Update Account Detail</Button>
          <Button onClick={this._handleSetView}>Password Settings</Button>
        </div>
      )
    }
  }
}

const Settings = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <PasswordForgetForm />
        <PasswordChangeForm />
        <Button>back</Button>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuth(withAuthorization(condition)(AccountPage));

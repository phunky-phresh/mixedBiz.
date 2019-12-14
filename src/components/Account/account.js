import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session/session';


import { PasswordForgetForm } from './pwordforget';
import PasswordChangeForm from './pwordchange';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);

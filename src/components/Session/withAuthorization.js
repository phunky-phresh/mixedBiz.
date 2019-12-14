import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './session-context';
import { withFirebase } from '../Firebase/fireIndex';
import * as ROUTES from '../../constants/routes';

const withAuthorization = (condition) => InnerComponent => {
  class WithAuthorization extends React.Component {

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(ROUTES.SIGN_IN);
        }
      });
    }
    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <InnerComponent {...this.props} /> :null
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return compose(withRouter, withFirebase)(WithAuthorization) ;
}

export default withAuthorization;

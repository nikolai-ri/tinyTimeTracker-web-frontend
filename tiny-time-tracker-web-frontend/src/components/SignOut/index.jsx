import React from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';

class SignOutButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firebase: props.firebase,
      history: props.history
    }
  }

  handleOnClick() {
    this.state.firebase.doSignOut();
    this.state.history.push(ROUTES.SIGN_IN);
  }

  render() {
    return (
      <button type="button" onClick={this.handleOnClick.bind(this)}>
        Sign Out
     </button>
    );
  }
}

export default SignOutButton = compose(
  withRouter,
  withFirebase,
)(SignOutButton);

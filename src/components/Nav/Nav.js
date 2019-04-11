import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../../utils/history.js';
import axios from 'axios';
import './nav.scss';

export default class Nav extends Component {
  logout() {
    axios.get('/api/signout')
      .then((res) => {
        this.props.set({user: {}});
        history.push('/');
      })
      .catch((err) => {
        alert("Sign Out error. Please try again");
      });
  }

  render () {
    const username = this.props.user.username;
    return (
      <div className='col-sm-12 col-md-3 col-lg-2 navbar-container'>
        <nav>
          <h2><Link className="text-dark" to='/'>CodeBin</Link></h2>
          <p>Create</p>
          <Link className="btn btn-primary btn-block" to={'/bin/new'}>New Bin</Link>
          {username ? (
            <>
              <p>Your</p>
              <Link className="btn btn-primary btn-block" to={'/' + username + '/dashboard'}>Dashboard</Link>
              <Link className="btn btn-primary btn-block" to={'/' + username + '/settings'}>Settings</Link>
              <button className="btn btn-primary btn-block" onClick={this.logout.bind(this)}>Sign Out</button>
            </>
          ) : (
            <>
              <p>Start Building</p>
              <Link className="btn btn-primary btn-block" to="/signin">Sign In</Link>
              <Link className="btn btn-primary btn-block" to="/signup">Sign Up</Link>
            </>
          )}
          <p>Explore</p>
          <button className="btn btn-primary btn-block">Pens</button>
        </nav>
      </div>
    );
  }
}
import './Callback.css';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { config } from './config';
import { OidcClient, Log } from 'oidc-client';
import jwt_decode from 'jwt-decode';

function Callback() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let callback = async () => {
      if (loggedIn) return;
      Log.logger = console;
      Log.level = Log.DEBUG;
      const oidcClient = new OidcClient(config);
      const response = await oidcClient.processSigninResponse(window.location.href);
      const access_token = response.access_token;
      const idToken = response.id_token;
      const decoded = jwt_decode(idToken);
      const address = decoded.sub;
      localStorage.setItem('oasis-docs-address', address);
      localStorage.setItem('oasis-docs-token', access_token);
      setLoggedIn(true);
    };

    callback();
  }, [loggedIn]);

  return loggedIn ? <Redirect to={`/myfiles`} /> : '';
}

export default withRouter(Callback);
